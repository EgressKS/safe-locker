const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const showAllAlbums = asyncHandler(async (req, res) => {
    const currentUser_id = req.user?.user_id;
    const { category_id } = req.query;

    if (!category_id) {
        res.status(400).json({
            message: "Category ID is required"
        });
        return;
    }

    try {
        const [allAlbums] = await mysqlconnection.query(`
            SELECT * FROM Albums WHERE user_id = ? AND category_id = ?
        `, [currentUser_id, category_id]);

        if (allAlbums.length > 0) {
            res.status(200).json({
                message: "Successfully retrieved all albums",
                data: allAlbums
            });
        } else {
            res.status(404).json({
                message: `No albums found for user ID ${currentUser_id} in category ID ${category_id}`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = showAllAlbums;
