const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");

const updateAlbumTitle = asyncHandler(async (req, res) => {
    const { albumTitle, album_id } = req.body;

    // Start a MySQL transaction
    const connection = await mysqlconnection.getConnection();
    await connection.beginTransaction(); // Transaction starts

    try {
        const [updateData] = await connection.query(`
            UPDATE Albums SET album_name = ? WHERE album_id = ?
        `, [albumTitle, album_id]);

        if (updateData.affectedRows === 0) {
            await connection.rollback();
            res.status(404);
            throw new Error("Album not found!");
        }

        await connection.commit();

        res.status(200).json({
            message: "Successfully updated album title",
            updatedAlbum: updateData
        });
    } catch (error) {
        await connection.rollback();
        res.status(500);
        throw new Error(error.message || "Internal Server Error");
    } finally {
        connection.release();
    }
});

module.exports = updateAlbumTitle;
