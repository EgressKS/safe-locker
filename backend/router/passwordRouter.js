const express = require("express");
const router = express.Router();

// const validateToken = require("../middleware/validateToken");
const validateToken2 = require('../middleware/validateToken2.0');

const CreateActTitle = require("../controller/Password/PasswordTitle/createPassTitle");
const deleteActTitle = require("../controller/Password/PasswordTitle/deletePassTite");
const showAllActTitle = require("../controller/Password/PasswordTitle/showAllPassTitle");
const upadateTitleName = require("../controller/Password/PasswordTitle/upadateTitleName");

const AddActDetail = require("../controller/Password/PasswordDetail/addPassDetail");
const deleteActDetail = require("../controller/Password/PasswordDetail/deletePassDetail");
const showAllActDetail = require("../controller/Password/PasswordDetail/showAllPassDetail");
const UpdateActDetail = require("../controller/Password/PasswordDetail/updatePassDetail");


// --------------------------Password-Tite---------------------------------------------//
// create;
router.route("/createtitle").post(validateToken2,CreateActTitle);
// detete
router.route("/deletetitle").delete(validateToken2,deleteActTitle);
// show-all
router.route("/showtitle").get(validateToken2,showAllActTitle);
// update
router.route("/updatetitle").put(validateToken2,upadateTitleName);

// --------------------------Password-detail-----------------------------------------//
// add
router.route("/adddetail").post(validateToken2,AddActDetail);
// detete
router.route("/deletedetail").delete(validateToken2,deleteActDetail);
// show-all
router.route("/showdetail").get(validateToken2,showAllActDetail);
// update
router.route("/updatedetail").put(validateToken2,UpdateActDetail);


module.exports = router;