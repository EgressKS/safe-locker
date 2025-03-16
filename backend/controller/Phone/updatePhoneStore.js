const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../config/mysqlConfig");
const fs = require("fs");
const path = require("path");
const upload = require("../../middleware/multer.middleware");
const { downloadFileFromCloudinary, uploadOnCloudinary } = require("../../util/cloudinary");
const { encryptFile, decryptFile } = require("../../util/encrypt&decrypt");
const accessKeyAndIV = require("../..//util/accesskey&iv");
const binaryFileToOriginalFileUrl = require("../../util/binaryfileToOrginalFile");

const updatePhoneStore = asyncHandler(async (req, res) => {
    upload.single("contact_picture")(req, res, async function (err) {
        if (err) {
            res.status(400);
            throw new Error(err.message);
        }
        
        const { contact_name, phone_number, contact_id, is_in_whatsapp } = req.body;
        const currentUser_id = req.user?.user_id;

        if (!contact_name || !phone_number || !contact_id) {
            res.status(400);
            throw new Error("All fields are mandatory!");
        }

        // Start a MySQL transaction
        const connection = await mysqlconnection.getConnection();
        await connection.beginTransaction();

        try {
            // Check if contact exists
            const [contactExists] = await connection.query(
                "SELECT * FROM PhoneBook WHERE contact_id = ? AND user_id = ?",
                [contact_id, currentUser_id]
            );

            if (contactExists.length === 0) {
                await connection.rollback();
                res.status(404).send({ message: "Contact not found!" });
                return;
            }

            let fileUrl = contactExists[0].contact_picture_url;
            let publicId = contactExists[0].public_id_from_cloudinary;
            const aeskeyAndIV = await accessKeyAndIV(currentUser_id);

            if (req.file) {
                const localFilePath = req.file.path;

                // Encrypt and upload the image to Cloudinary
                const encryptedFilePath = await encryptFile(localFilePath, aeskeyAndIV.key, aeskeyAndIV.iv);
                const cloudinaryResult = await uploadOnCloudinary(encryptedFilePath, publicId);

                if (!cloudinaryResult) {
                    await connection.rollback();
                    res.status(400);
                    throw new Error("Unable to upload contact picture to Cloudinary!");
                }

                fileUrl = cloudinaryResult.url;
                publicId = cloudinaryResult.publicId;
            }

            // Update contact details
            const [updateRow] = await connection.query(
                `UPDATE PhoneBook 
                 SET contact_name = ?, phone_number = ?, contact_picture_url = ?, public_id_from_cloudinary = ?, is_in_whatsapp = ?
                 WHERE contact_id = ? AND user_id = ?`,
                [contact_name, phone_number, fileUrl, publicId, is_in_whatsapp, contact_id, currentUser_id]
            );

            if (updateRow.affectedRows === 0) {
                await connection.rollback();
                res.status(400).send({ message: "Error updating contact details!" });
                return;
            }

            await connection.commit();

            // Fetch updated contact details
            const [result] = await connection.query(
                "SELECT * FROM PhoneBook WHERE contact_id = ?",
                [contact_id]
            );

            // Download and decrypt image if available
            let contact_picture_url = result[0].contact_picture_url;
            if (contact_picture_url) {
                const encryptedFilePathDownloaded = await downloadFileFromCloudinary(
                    contact_picture_url,
                    path.join(__dirname, '../../../public/temp')
                );

                if (!encryptedFilePathDownloaded) {
                    throw new Error("Failed to download the encrypted contact picture from Cloudinary.");
                }

                const decryptedFilePath = await decryptFile(encryptedFilePathDownloaded, aeskeyAndIV.key, aeskeyAndIV.iv);
                contact_picture_url = binaryFileToOriginalFileUrl(decryptedFilePath, "image");
            }

            const contactDetail = {
                contact_id: result[0].contact_id,
                user_id: result[0].user_id,
                contact_name: result[0].contact_name,
                phone_number: result[0].phone_number,
                contact_picture_url: contact_picture_url,
                is_in_whatsapp: result[0].is_in_whatsapp,
                created_at: result[0].created_at,
            };

            res.status(200).send({
                message: "Contact details updated successfully",
                contact: contactDetail
            });

        } catch (error) {
            await connection.rollback();
            res.status(500).send({ message: error.message || "Internal Server Error" });
            console.error("Error:", error);
        } finally {
            connection.release();

            // Cleanup: Delete the local file if it exists
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error("Failed to delete the local file:", err);
                    }
                });
            }
        }
    });
});

module.exports = updatePhoneStore;