const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const deleteAlbum = asyncHandler(async (req, res) => {
    const { album_id } = req.body;

    try {
        const [result] = await mysqlconnection.query(
            `DELETE FROM Albums WHERE album_id = ?`,
            [album_id]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error("Album not found!");
        }

        res.status(200).json({
            message: "Successfully deleted album and associated details",
        });

    } catch (error) {
        // Handle the error appropriately
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

module.exports = deleteAlbum;
