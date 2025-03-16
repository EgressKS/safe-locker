const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const updateTitleName = asyncHandler(async (req, res) => {
    const { titleName, pass_id } = req.body;

    if (!titleName || !pass_id) {
        throw new Error("pass_id and titleName are required!");
    }

    // Start a MySQL transaction
    const connection = await mysqlconnection.getConnection();
    await connection.beginTransaction();

    try {
        const [result] = await connection.query(
            `UPDATE Password SET pass_title_name = ? WHERE pass_id = ?`,
            [titleName, pass_id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Password title not found or no changes made");
        }

        await connection.commit();

        res.status(200).json({
            message: "Successfully updated",
            updatedTitle: titleName,
            pass_id: pass_id
        });
    } catch (error) {
        await connection.rollback();
        throw new Error(error.message || "Internal Server Error");
    } finally {
        connection.release();
    }
});

module.exports = updateTitleName;
