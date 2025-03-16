const asyncHandler = require('express-async-handler');
const mysqlconnection = require('../../../config/mysqlConfig');
const { encryptData } = require("../../../util/encrypt&decrypt");
const accessKeyAndIV = require("../../../util/accesskey&iv");

const AddPassDetail = asyncHandler(async (req, res) => {
    const { email, password, link, pass_id } = req.body;
    const currentUser_id = req.user?.user_id;

    if (!email || !password || !pass_id) {
        throw new Error("email, password, and pass_id are required!");
    }

    const connection = await mysqlconnection.getConnection();
    await connection.beginTransaction();

    try {
        const [passTitleRows] = await connection.query(
            `SELECT * FROM Password WHERE pass_id = ?`,
            [pass_id]
        );

        if (passTitleRows.length === 0) {
            throw new Error("Password title not found");
        }

        // Access user key and IV
        const aesKeyAndIV = await accessKeyAndIV(currentUser_id);
        const encryptedPassword = encryptData(password, aesKeyAndIV.key, aesKeyAndIV.iv);

        // Insert into PasswordDetail
        const [result] = await connection.query(
            `INSERT INTO PasswordDetail (email, password, link_website, pass_id) 
            VALUES (?, ?, ?, ?)`,
            [email, encryptedPassword, link, pass_id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Failed to insert password details");
        }

        await connection.commit();

        res.status(201).json({
            message: "Successfully created",
            pass_detail_id: result.insertId,
            email: email,
            pass_id: pass_id
        });

    } catch (error) {
        await connection.rollback();
        throw new Error(error.message || "Internal Server Error!");
    } finally {
        connection.release();
    }
});

module.exports = AddPassDetail;
