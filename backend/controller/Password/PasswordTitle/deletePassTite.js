const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const deletePassTitle = asyncHandler(async (req, res) => {
    const { pass_id } = req.body;

    if (!pass_id) {
        throw new Error("pass_id is required!");
    }

    try {
        const [deleteRow] = await mysqlconnection.query(
            `DELETE FROM Password WHERE pass_id = ?`,
            [pass_id]
        );

        // Check if any rows were affected 
        if (deleteRow.affectedRows === 0) {
            throw new Error("Password title not found!");
        }

        res.status(200).json({ message: "Successfully deleted" });

    } catch (error) {
        throw new Error(error.message || "Internal Server Error!");
    }
});

module.exports = deletePassTitle;
