const express = require("express");
const router = express.Router();

const AddDocDetail = require("../controller/Document/albumsDetail/addAlbumDetail");
const deleteDocDetail = require("../controller/Document/albumsDetail/deleteAlbumDetail");
const showAllDetail = require("../controller/Document/albumsDetail/showAllDetail");
const updateDocDetail = require("../controller/Document/albumsDetail/updateAlbumDetail");

const createDocTitle = require("../controller/Document/albumsTitle/createAlbumTitle");
const deleteDocTitel = require("../controller/Document/albumsTitle/deleteAlbumTitel");
const showalldocTitle = require("../controller/Document/albumsTitle/showallAlbumTitle");
const updateDoctitle = require("../controller/Document/albumsTitle/updateAlbumTite");

const validateToken2 = require("../middleware/validateToken2.0");

// createDocTitle
router.route("/createtitle").post(validateToken2,createDocTitle);

// deleteDocTitel
router.route("/deletetitle").delete(validateToken2,deleteDocTitel);

// showalldocTitle
router.route("/showalltitle").get(validateToken2,showalldocTitle);

// updateDoctitle
router.route("/updatetitle").put(validateToken2,updateDoctitle);


//----------------------------AlbumDetail------------------------------------

// AddDocDetail
router.route("/addetail").post(validateToken2,AddDocDetail);

// deleteDocDetail
router.route("/deletedetail").delete(validateToken2,deleteDocDetail);

// showAllDetail
router.route("/showalldetail").get(validateToken2,showAllDetail);

// updateDocDetail
router.route("/updatedetail").put(validateToken2,updateDocDetail);

module.exports = router;
