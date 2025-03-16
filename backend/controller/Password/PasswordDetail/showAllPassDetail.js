const asyncHandler = require("express-async-handler");
const mysqlconnection = require("../../../config/mysqlConfig");
const { decryptData } = require("../../../util/encrypt&decrypt");
const accessKeyAndIV = require("../../../util/accesskey&iv");

const showAllPassDetail = asyncHandler(async (req, res) => {
    const { pass_title_name } = req.body;  // Changed to match your column name
    const currentUser_id = req.user?.user_id;  // Assuming user_id is available from req.user

    // Query to get pass_id based on pass_title_name and user_id
    const [result] = await mysqlconnection.query(`
        SELECT pass_id FROM Password WHERE pass_title_name = ? AND user_id = ?
    `, [pass_title_name, currentUser_id]);

    // Check if the pass_id was not found
    if (result.length === 0) {
        res.status(404);
        throw new Error("Password title not found!");
    }
    const Require_pass_id = result[0].pass_id;

    // Query to get all password details for the given pass_id
    const [allDataResult] = await mysqlconnection.query(`
        SELECT * FROM PasswordDetail WHERE pass_id = ?
    `, [Require_pass_id]);

    // Check if any password details are found
    if (allDataResult.length === 0) {
        res.status(404);
        throw new Error("No password details found!");
    }

    // Decrypt password details and format response
    const userPassDetail = [];
    const aeskeyAndIV = await accessKeyAndIV(currentUser_id);

    allDataResult.forEach((item) => {
        const tempStorage = {
            pass_detail_id: item.pass_detail_id,
            pass_id: item.pass_id,
            email: item.email,
            password: decryptData(item.password, aeskeyAndIV.key, aeskeyAndIV.iv),
            link_website: item.link_website,
            short_note: item.short_note  // Including short_note as it exists in your schema
        };
        userPassDetail.push(tempStorage);
    });

    // Return the decrypted password details
    res.status(200).json({
        message: "Successfully retrieved password details",
        data: userPassDetail
    });
});

module.exports = showAllPassDetail;
