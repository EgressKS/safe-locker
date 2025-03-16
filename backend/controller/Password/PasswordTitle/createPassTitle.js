require("dotenv").config();
const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const CreatePassTitle = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const currentUser_id = req.user?.user_id;

    if (!title) {
        throw new Error("Title is required!");
    }

    // Start a MySQL transaction
    const connection = await mysqlconnection.getConnection();
    await connection.beginTransaction();

    try {
        const [result] = await connection.query(
            `INSERT INTO Password (user_id, pass_title_name) VALUES (?, ?)`,
            [currentUser_id, title]
        );

        await connection.commit();
        res.status(201).json({
            message: "Successfully created",
            pass_id: result.insertId,
            passTitle: title,
            user_id: currentUser_id
        });

    } catch (error) {
        await connection.rollback();
        throw new Error("Failed to create password record");
    } finally {
        connection.release();
    }
});

module.exports = CreatePassTitle;
