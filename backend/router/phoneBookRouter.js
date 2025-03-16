const express = require('express');
const router = express.Router();

const validateToken = require('../middleware/validateToken');
const validateToken2 = require('../middleware/validateToken2.0');
const createPhoneStore = require('../controller/Phone/createPhoneStore');
const deletePhoneStore = require('../controller/Phone/deletePhoneStore');
const updatePhoneStore = require('../controller/Phone/updatePhoneStore');
const showAllPhoneStore = require('../controller/Phone/showAllPhoneStore');

// createPhoneStore
router.route('/createPhoneStore').post(validateToken2,createPhoneStore);

// deletePhoneStore
router.route('/deletePhoneStore').delete(validateToken2,deletePhoneStore);

// updatePhoneStore
router.route('/updatePhoneStore').put(validateToken2,updatePhoneStore);

//showAllPhoneStore
router.route('/showAllPhoneStore').get(validateToken2,showAllPhoneStore);

module.exports = router;