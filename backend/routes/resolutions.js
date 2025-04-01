const express = require('express');
const router = express.Router();
const resolutionsController = require('../controllers/resolutionsController');
const complaintsController = require("../controllers/complaintsController");

router.get('/', resolutionsController.getResolutions);
router.get('/:id', resolutionsController.getResolutionById);
router.put('/', resolutionsController.updateResolution);

module.exports = router;