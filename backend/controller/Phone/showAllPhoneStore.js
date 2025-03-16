const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../config/mysqlConfig");
const { downloadFileFromCloudinary } = require("../../util/cloudinary");
const { decryptFile } = require("../../util/encrypt&decrypt");
const accessKeyAndIV = require("../../util/accesskey&iv");
const binaryFileToOriginalFileUrl = require("../../util/binaryfileToOrginalFile");
const path = require("path"); // ✅ Import path module

const showAllPhoneStore = asyncHandler(async (req, res) => {
    const currentUser_id = req.user?.user_id;

    try {
        // Fetch all contacts for the user
        const [contacts] = await mysqlconnection.query(
            "SELECT * FROM PhoneBook WHERE user_id = ?",
            [currentUser_id]
        );

        if (contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found!" });
        }

        const aeskeyAndIV = await accessKeyAndIV(currentUser_id);

        // Process each contact
        const processedContacts = await Promise.all(contacts.map(async (contact) => {
            let contact_picture_url = contact.contact_picture_url;
            let file_url = null; // ✅ Ensure file_url is always defined

            if (contact_picture_url) {
                try {
                    // Download encrypted image from Cloudinary
                    const encryptedFilePath = await downloadFileFromCloudinary(
                        contact_picture_url,
                        path.join(__dirname, '../../public/temp')
                    );

                    if (!encryptedFilePath) {
                        console.error(`Failed to download file`);
                        throw new Error("Failed to download encrypted file from Cloudinary.");
                    }

                    // Decrypt the file
                    const decryptedFilePath = await decryptFile(encryptedFilePath, aeskeyAndIV.key, aeskeyAndIV.iv);
                    if (!decryptedFilePath) {
                        console.error(`Decryption failed`);
                        throw new Error("Decryption failed for the file.");
                    }

                    // Convert the decrypted binary file to a readable URL
                    file_url = binaryFileToOriginalFileUrl(decryptedFilePath, "image/"); 
                } catch (error) {
                    console.error("Failed to process contact picture:", error);
                }
            }

            return {
                contact_id: contact.contact_id,
                contact_name: contact.contact_name,
                phone_number: contact.phone_number,
                contact_picture_url: file_url, // ✅ file_url is always defined (even if null)
                is_in_whatsapp: contact.is_in_whatsapp,
                created_at: contact.created_at,
            };
        }));

        res.status(200).json({ contacts: processedContacts });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = showAllPhoneStore;
