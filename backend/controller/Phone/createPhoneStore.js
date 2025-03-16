const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../config/mysqlConfig");
const upload = require("../../middleware/multer.middleware");
const fs = require("fs");
const path = require("path");
const { downloadFileFromCloudinary, uploadOnCloudinary } = require("../../util/cloudinary");
const { encryptFile, decryptFile } = require("../../util/encrypt&decrypt");
const accessKeyAndIV = require("../..//util/accesskey&iv");
const binaryFileToOriginalFileUrl = require("../../util/binaryfileToOrginalFile");

const createPhoneStore = asyncHandler(async (req, res) => {
    upload.single("contact_profile")(req, res, async function (err) {
        if (err) {
            res.status(400);
            throw new Error(err.message);
        }

        const { contact_name, phone_number, is_in_whatsapp } = req.body;
        const currentUser_id = req.user?.user_id;

        if (!contact_name || !phone_number) {
            res.status(400);
            throw new Error("Contact name and phone number are mandatory!");
        }

        // Start MySQL transaction
        const connection = await mysqlconnection.getConnection();
        await connection.beginTransaction();
        const aeskeyAndIV = await accessKeyAndIV(currentUser_id);

        try {
            let profileUrl = null;
            let publicId = null;

            if (req.file) {
                // Encrypt the image before uploading
                const encryptedFilePath = await encryptFile(req.file.path, aeskeyAndIV.key, aeskeyAndIV.iv);

                // Upload encrypted file to Cloudinary
                const cloudinaryResponse = await uploadOnCloudinary(encryptedFilePath, null);

                if (!cloudinaryResponse) {
                    await connection.rollback();
                    res.status(400);
                    throw new Error("Failed to upload profile picture to Cloudinary!");
                }

                profileUrl = cloudinaryResponse.url;
                publicId = cloudinaryResponse.publicId;
            }

            // Insert contact details into PhoneBook
            const [result] = await connection.query(`
                INSERT INTO PhoneBook (user_id, contact_name, phone_number, contact_picture_url, public_id_from_cloudinary, is_in_whatsapp)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [currentUser_id, contact_name, phone_number, profileUrl, publicId, is_in_whatsapp || false]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                res.status(400);
                throw new Error("Failed to save contact details!");
            }

            await connection.commit();

            // Retrieve and decrypt the profile picture if uploaded
            let decryptedProfileUrl = null;
            if (profileUrl) {
                const downloadedFilePath = await downloadFileFromCloudinary(profileUrl, path.join(__dirname, '../../../public/temp'));
                const decryptedFilePath = await decryptFile(downloadedFilePath, aeskeyAndIV.key, aeskeyAndIV.iv);
                decryptedProfileUrl = binaryFileToOriginalFileUrl(decryptedFilePath, req.file.mimetype);
            }

            res.status(201).json({
                message: "Contact saved successfully",
                contact: {
                    contact_id: result.insertId,
                    contact_name,
                    phone_number,
                    contact_picture_url: decryptedProfileUrl,
                    is_in_whatsapp
                }
            });
        } catch (error) {
            await connection.rollback();
            res.status(500);
            throw new Error(error.message || "Internal Server Error");
        } finally {
            connection.release();

            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Failed to delete local file:", err);
                });
            }
        }
    });
});

module.exports = createPhoneStore;