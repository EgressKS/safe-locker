const asyncHandler = require('express-async-handler');
const mysqlconnection = require("../../../config/mysqlConfig");
const { encryptData } = require("../../../util/encrypt&decrypt");
const accessKeyAndIV = require("../../../util/accesskey&iv");

const UpdateActDetail = asyncHandler(async (req, res) => {
    const { pass_detail_id, email, password, link_website, short_note } = req.body;
    const currentUser_id = req.user?.user_id;
    // Start a transaction
    const connection = await mysqlconnection.getConnection();
    await connection.beginTransaction();

    try {
        // Fetch the pass_id from the Password table using pass_detail_id
        const [passwordDetails] = await connection.query(`
            SELECT pass_id FROM PasswordDetail WHERE pass_detail_id = ? AND pass_id IN (SELECT pass_id FROM Password WHERE user_id = ?)
        `, [pass_detail_id, currentUser_id]);

        // If pass_id is not found, throw an error
        if (passwordDetails.length === 0) {
            throw new Error("Password detail not found or you don't have permission to update it");
        }

        const pass_id = passwordDetails[0].pass_id;

        // Access AES key and IV
        const aeskeyAndIV = await accessKeyAndIV(currentUser_id);
        const encryptPassword = encryptData(password, aeskeyAndIV.key, aeskeyAndIV.iv);

        // Update the PasswordDetail table
        const [result] = await connection.query(`
            UPDATE PasswordDetail 
            SET email = ?, password = ?, link_website = ?, short_note = ? 
            WHERE pass_detail_id = ? AND pass_id = ?
        `, [email, encryptPassword, link_website, short_note, pass_detail_id, pass_id]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            throw new Error("Account detail not found or no changes made");
        }

        // Get the updated data
        const [updatedDetail] = await connection.query(`
            SELECT pass_detail_id, pass_id, email, link_website, short_note 
            FROM PasswordDetail WHERE pass_detail_id = ?
        `, [pass_detail_id]);

        // Commit the transaction if update is successful
        await connection.commit();
        
        res.status(200).json({
            message: "Successfully updated account detail",
            updatedAccountDetail: updatedDetail[0] // Return updated data
        });
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();

        // Sending a clear error message to the client
        res.status(500).json({
            error: error.message || "Internal Server Error"
        });
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
});

module.exports = UpdateActDetail;
