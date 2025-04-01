const express = require('express');
const router = express.Router();
const resolutionsHistoryController = require('../controllers/resolutionsHistoryController');

router.get('/', resolutionsHistoryController.getResolutionsHistory);
router.get('/:id', resolutionsHistoryController.getResolutionHistoryById);
router.post('/', resolutionsHistoryController.createResolutionHistory);

module.exports = router;
