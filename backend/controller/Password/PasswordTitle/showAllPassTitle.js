const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const showAllPassTitles = asyncHandler(async (req, res) => {
    const currentUser_id = req.user?.user_id; // Ensure correct user_id access

    if (!currentUser_id) {
        throw new Error("User ID is required!");
    }

    const [allPassTitles] = await mysqlconnection.query(
        `SELECT pass_id, pass_title_name, icon FROM Password WHERE user_id = ?`,
        [currentUser_id]
    );

    if (allPassTitles.length > 0) {
        res.status(200).json({
            message: "Successfully retrieved password titles",
            data: allPassTitles
        });
    } else {
        throw new Error("No password titles found for the given user ID");
    }
});

module.exports = showAllPassTitles;
