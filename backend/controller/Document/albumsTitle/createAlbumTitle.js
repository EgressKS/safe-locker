const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const createAlbum = asyncHandler(async (req, res) => {
    const { albumTitle, categoryId } = req.body;
    const currentUser_id = req.user?.user_id;

    if (!albumTitle || !categoryId) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    // Start a MySQL transaction
    const connection = await mysqlconnection.getConnection();
    await connection.beginTransaction(); // Transaction starts

    try {
        const [albumData] = await connection.query(`
            INSERT INTO Albums (user_id, category_id, album_name) VALUES (?, ?, ?)
        `, [currentUser_id, categoryId, albumTitle]);

        if (!albumData || albumData.length === 0) {
            await connection.rollback();
            res.status(400);
            throw new Error("Error on creating album!");
        }

        await connection.commit();

        res.status(200).json({
            message: "Successfully created album",
            album_id: albumData.insertId,
            album_name: albumTitle,
            user_id: currentUser_id,
            category_id: categoryId
        });
    } catch (error) {
        await connection.rollback();
        res.status(500);
        throw new Error(error.message || "Internal Server Error");
    } finally {
        connection.release();
    }
});

module.exports = createAlbum;
