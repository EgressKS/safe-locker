const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");
const path = require("path");
const { downloadFileFromCloudinary, uploadOnCloudinary } = require("../../../util/cloudinary");
const { encryptFile, decryptFile } = require("../../../util/encrypt&decrypt");
const accessKeyAndIV = require("../../../util/accesskey&iv");
const binaryFileToOriginalFileUrl = require("../../../util/binaryfileToOrginalFile");

const showAllDetail = asyncHandler(async (req, res) => {
    const { album_id } = req.body; // Now using album_id instead of doc_title
    const currentUser_id = req.user?.user_id;

    try {
        // Fetch album details based on album_id and user_id
        const [albumResult] = await mysqlconnection.query(`
            SELECT a.album_id, a.album_name, c.category_name
            FROM Albums a
            JOIN CategoriesOfFileManger c ON a.category_id = c.category_id
            WHERE a.album_id = ? AND a.user_id = ?
        `, [album_id, currentUser_id]);

        if (albumResult.length === 0) {
            res.status(404);
            throw new Error("Album not found!");
        }

        const { album_id: foundAlbumId, album_name, category_name } = albumResult[0];

        // Fetch all files associated with the album
        const [filesResult] = await mysqlconnection.query(`
            SELECT * FROM Files WHERE album_id = ?
        `, [foundAlbumId]);

        if (filesResult.length === 0) {
            res.status(404);
            throw new Error("No files found in this album.");
        }

        const aeskeyAndIV = await accessKeyAndIV(currentUser_id);

        // Use Promise.all() to handle asynchronous operations in parallel
        const userFileDetails = await Promise.all(
            filesResult.map(async (item, index) => {

                // Download the encrypted file from Cloudinary
                const encryptedFilePath = await downloadFileFromCloudinary(
                    item.file_url,  // Use file_url instead of doc_file
                    path.join(__dirname, '../../../public/temp')
                );

                if (!encryptedFilePath) {
                    console.error(`Failed to download file for item ${index + 1}`);
                    throw new Error("Failed to download encrypted file from Cloudinary.");
                }

                // Decrypt the file
                const decryptedFilePath = await decryptFile(encryptedFilePath, aeskeyAndIV.key, aeskeyAndIV.iv);
                if (!decryptedFilePath) {
                    console.error(`Decryption failed for item ${index + 1}`);
                    throw new Error("Decryption failed for the file.");
                }

                // Convert the decrypted binary file to a readable URL
                const file_url = binaryFileToOriginalFileUrl(decryptedFilePath, item.file_extension);

                return {
                    file_id: item.file_id,
                    album_id: item.album_id,
                    file_name: item.file_name,
                    file_url: file_url,  // Update this to reflect the decrypted URL
                    file_extension: item.file_extension
                };
            })
        );

        // Send the response with decrypted file details
        res.status(200).json({
            message: "Successfully retrieved file details",
            album: {
                album_id: foundAlbumId,
                album_name,
                category_name
            },
            files: userFileDetails
        });

    } catch (error) {
        console.error("Error processing file details:", error);
        res.status(500);
        throw new Error(error.message || "Internal Server Error");
    }
});

module.exports = showAllDetail;
