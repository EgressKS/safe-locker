const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../config/mysqlConfig");
const { deleteOnCloudinary } = require("../../util/cloudinary");

const deletePhoneStore = asyncHandler(async (req, res) => {
    const { contact_id } = req.body;
    const currentUser_id = req.user?.user_id;

    if (!contact_id) {
        res.status(400);
        throw new Error("Contact ID is required!");
    }

    // Start a MySQL transaction
    const connection = await mysqlconnection.getConnection();
    await connection.beginTransaction();

    try {
        // Fetch the contact to check ownership and get the profile picture details
        const [contact] = await connection.query(
            `SELECT public_id_from_cloudinary FROM PhoneBook WHERE contact_id = ? AND user_id = ?`,
            [contact_id, currentUser_id]
        );

        if (contact.length === 0) {
            await connection.rollback();
            res.status(404);
            throw new Error("Contact not found or does not belong to the user!");
        }

        const publicId = contact[0].public_id_from_cloudinary;

        // Delete contact from PhoneBook
        const [deleteResult] = await connection.query(
            `DELETE FROM PhoneBook WHERE contact_id = ? AND user_id = ?`,
            [contact_id, currentUser_id]
        );

        if (deleteResult.affectedRows === 0) {
            await connection.rollback();
            res.status(400);
            throw new Error("Failed to delete contact!");
        }

        // If a profile picture exists, delete it from Cloudinary
        if (publicId) {
            const cloudinaryDeleteResponse = await deleteOnCloudinary(publicId);
            if (!cloudinaryDeleteResponse) {
                console.error("Failed to delete profile picture from Cloudinary.");
            }
        }

        // Commit the transaction
        await connection.commit();

        res.status(200).json({
            message: "Contact deleted successfully!",
        });
    } catch (error) {
        await connection.rollback();
        res.status(500);
        throw new Error(error.message || "Internal Server Error");
    } finally {
        connection.release();
    }
});

module.exports = deletePhoneStore;
