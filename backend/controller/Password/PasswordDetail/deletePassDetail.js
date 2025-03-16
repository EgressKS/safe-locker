const asyncHandler = require('express-async-handler');
const mysqlconnection = require('../../../config/mysqlConfig');

const deletePassDetail = asyncHandler(async (req, res) => {
    const { pass_detail_id } = req.body;

    if (!pass_detail_id) {
        throw new Error("pass_detail_id is required!");
    }

    const [deleteRow] = await mysqlconnection.query(
        `DELETE FROM PasswordDetail WHERE pass_detail_id = ?`,
        [pass_detail_id]
    );

    if (deleteRow.affectedRows === 0) {
        throw new Error("No password detail found for the given ID!");
    }

    res.status(200).json({ message: "Successfully deleted" });
});

module.exports = deletePassDetail;
