const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");
const { deleteOnCloudinary } = require("../../../util/cloudinary");

const deleteDocDetail = asyncHandler(async (req, res) => {
    const { file_id } = req.body;  // Assuming you will pass the file_id to delete a file.

    try {
        // Check if the file exists in the Files table
        const [fileExist] = await mysqlconnection.query(`
            SELECT * FROM Files WHERE file_id = ?
        `, [file_id]);

        if (fileExist.length === 0) {
            res.status(404).json({
                message: "File not found!"
            });
            return;
        }

        // Delete the file entry from the Files table
        const [deleteFile] = await mysqlconnection.query(`
            DELETE FROM Files WHERE file_id = ?
        `, [file_id]);

        if (deleteFile.affectedRows === 0) {
            res.status(404).json({
                message: "File not deleted!"
            });
            return;
        }

        // Delete the file from Cloudinary
        const deleteOnCloudinaryFile = await deleteOnCloudinary(fileExist[0].public_id_from_cloudinary);

        if (!deleteOnCloudinaryFile) {
            res.status(500).json({
                message: "Error deleting file from Cloudinary!"
            });
            return;
        }

        res.status(200).json({
            message: "Successfully deleted file."
        });

    } catch (err) {
        console.error("Error in deleteDocDetail:", err.message);
        res.status(500).json({
            message: err.message || "Internal Server Error"
        });
    }
});

module.exports = deleteDocDetail;
