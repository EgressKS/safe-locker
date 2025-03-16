const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");
const upload = require("../../../middleware/multer.middleware");
const fs = require("fs");
const path = require("path");
const { uploadOnCloudinary, downloadFileFromCloudinary } = require("../../../util/cloudinary");
const accessKeyAndIV = require("../../../util/accesskey&iv");
const { encryptFile, decryptFile } = require("../../../util/encrypt&decrypt");
const binaryFileToOriginalFileUrl = require("../../../util/binaryfileToOrginalFile");

const updateDocDetail = asyncHandler(async (req, res) => {
    upload.single("docfile")(req, res, async function (err) {
        if (err) {
            res.status(400);
            throw new Error(err.message);
        }
        
        const { file_name, file_id } = req.body;
        const currentUser_id = req.user?.user_id;

        if (!file_name || !file_id) {
            res.status(400);
            throw new Error("All fields are mandatory!");
        }

        // Start a MySQL transaction
        const connection = await mysqlconnection.getConnection();
        await connection.beginTransaction();

        try {
            // Check if file detail exists in Files table
            const [rowExists] = await connection.query(`
                SELECT * FROM Files WHERE file_id = ?
            `, [file_id]);

            if (rowExists.length === 0) {
                await connection.rollback();
                res.status(404).send({ message: "File detail not found!" });
                return;
            }

            const aeskeyAndIV = await accessKeyAndIV(currentUser_id);
            const localFilePath = req.file.path;

            // Encrypt and upload the file to Cloudinary
            const encryptedFilePath = await encryptFile(localFilePath, aeskeyAndIV.key, aeskeyAndIV.iv);
            const oldFilePublicId = rowExists[0].public_id_from_cloudinary;
            const cloudinaryResult = await uploadOnCloudinary(encryptedFilePath, oldFilePublicId);

            if (!cloudinaryResult) {
                await connection.rollback();
                res.status(400);
                throw new Error("Unable to upload file to Cloudinary!");
            }

            const file_extension = req.file.mimetype;
            const fileUrl = cloudinaryResult.url;
            const publicId = cloudinaryResult.publicId;

            // Update file details in the Files table
            const [updateRow] = await connection.query(`
                UPDATE Files 
                SET file_name = ?, file_url = ?, file_extension = ?, public_id_from_cloudinary = ?
                WHERE file_id = ?
            `, [file_name, fileUrl, file_extension, publicId, file_id]);

            if (updateRow.affectedRows === 0) {
                await connection.rollback();
                res.status(400).send({ message: "Error updating file detail!" });
                return;
            }

            await connection.commit();

            // Fetch updated file details
            const [result] = await connection.query(`
                SELECT * FROM Files WHERE file_id = ?
            `, [file_id]);

            // Download and decrypt the file from Cloudinary
            const encryptedFilePathDownloaded = await downloadFileFromCloudinary(
                result[0].file_url,
                path.join(__dirname, '../../../public/temp')
            );

            if (!encryptedFilePathDownloaded) {
                throw new Error("Failed to download the encrypted file from Cloudinary.");
            }

            const decryptedFilePath = await decryptFile(encryptedFilePathDownloaded, aeskeyAndIV.key, aeskeyAndIV.iv);
            const file_url = binaryFileToOriginalFileUrl(decryptedFilePath, result[0].file_extension);

            // Prepare updated file detail for response
            const FileDetail = {
                file_id: result[0].file_id,
                album_id: result[0].album_id,
                file_name: result[0].file_name,
                file_url: file_url,
                file_extension: result[0].file_extension
            };

            res.status(200).send({
                message: "File detail updated successfully",
                file: FileDetail
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

module.exports = updateDocDetail;
