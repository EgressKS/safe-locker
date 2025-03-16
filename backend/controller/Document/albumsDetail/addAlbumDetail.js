const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");
const upload = require("../../../middleware/multer.middleware");
const fs = require("fs");
const path = require("path");
const { downloadFileFromCloudinary, uploadOnCloudinary } = require("../../../util/cloudinary");
const { encryptFile, decryptFile } = require("../../../util/encrypt&decrypt");
const accessKeyAndIV = require("../../../util/accesskey&iv");
const binaryFileToOriginalFileUrl = require("../../../util/binaryfileToOrginalFile");

const AddDocDetail = asyncHandler(async (req, res) => {
    upload.single("docfile")(req, res, async function (err) {
        if (err) {
            res.status(400);
            throw new Error(err.message);
        }

        const { doc_name, album_id, category_id } = req.body;
        const currentUser_id = req.user?.user_id;

        if (!doc_name || !album_id || !category_id) {
            res.status(400);
            throw new Error("All fields are mandatory!");
        }

        // Start a MySQL transaction
        const connection = await mysqlconnection.getConnection();
        await connection.beginTransaction();

        try {
            // Check if the album exists and matches the provided category_id
            const [albumRows] = await connection.query(`
                SELECT * FROM Albums WHERE album_id = ? AND category_id = ? AND user_id = ?
            `, [album_id, category_id, currentUser_id]);

            if (albumRows.length === 0) {
                await connection.rollback();
                res.status(404).json({
                    message: "Album not found under the specified category!"
                });
                return;
            }

            // Get file extension from the uploaded file
            const doc_extension = req.file.mimetype;

            // Insert into Files table
            const [rowData] = await connection.query(`
                INSERT INTO Files (album_id, file_name, file_url, file_extension) 
                VALUES (?, ?, ?, ?)
            `, [album_id, doc_name, req.file.path, doc_extension]);

            if (rowData.affectedRows === 0) {
                // Cleanup local file in case of failure
                if (req.file && req.file.path) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error("Failed to delete local file:", err);
                        }
                    });
                }
                await connection.rollback();
                res.status(400);
                throw new Error("Failed to insert file details!");
            }

            // Access the AES key and IV for encryption
            const aeskeyAndIV = await accessKeyAndIV(currentUser_id);
            const filePath = req.file.path;

            // Encrypt the file before uploading it to Cloudinary
            const encryptFilePath = await encryptFile(filePath, aeskeyAndIV.key, aeskeyAndIV.iv);

            // Upload the encrypted file to Cloudinary
            const cloudinaryUrlAndPublicID = await uploadOnCloudinary(encryptFilePath, null);

            if (!cloudinaryUrlAndPublicID) {
                await connection.rollback();
                res.status(400);
                throw new Error("Failed to upload document to Cloudinary!");
            }

            // Update the file URL and publicId from Cloudinary in the Files table
            const file_Url = cloudinaryUrlAndPublicID.url;
            const publicId = cloudinaryUrlAndPublicID.publicId;

            const [uploadFile] = await connection.query(`
                UPDATE Files 
                SET file_url = ?, public_id_from_cloudinary = ? 
                WHERE file_id = ?
            `, [file_Url, publicId, rowData.insertId]);

            if (uploadFile.affectedRows === 0) {
                await connection.rollback();
                res.status(400);
                throw new Error("Error updating file URL.");
            }

            // Commit the transaction after successful update
            await connection.commit();

            // Retrieve the updated file details
            const [result] = await connection.query(`
                SELECT * FROM Files WHERE file_id = ?
            `, [rowData.insertId]);

            // Download encrypted file from Cloudinary
            const encryptedFilePathDownloaded = await downloadFileFromCloudinary(
                result[0].file_url,
                path.join(__dirname, '../../../public/temp')
            );

            if (!encryptedFilePathDownloaded) {
                throw new Error("Failed to download encrypted document from Cloudinary.");
            }

            // Decrypt the file
            const decryptedFilePath = await decryptFile(encryptedFilePathDownloaded, aeskeyAndIV.key, aeskeyAndIV.iv);

            // Convert binary file to a readable URL
            const doc_file_url = binaryFileToOriginalFileUrl(decryptedFilePath, result[0].file_extension);

            // Prepare the response data
            const fileDetail = {
                file_id: result[0].file_id,
                album_id: result[0].album_id,
                file_name: result[0].file_name,
                file_url: doc_file_url,
                file_extension: result[0].file_extension
            };

            res.status(200).send({
                message: "File details uploaded successfully",
                file: fileDetail
            });

        } catch (error) {
            await connection.rollback();
            res.status(500);
            throw new Error(error.message || "Internal Server Error");
        } finally {
            connection.release();

            // Cleanup: Delete the local file if it exists
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error("Failed to delete local file:", err);
                    }
                });
            }
        }
    });
});

module.exports = AddDocDetail;
