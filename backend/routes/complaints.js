const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

// Route to get pending complaints [Parameterizeed routes are placed after normal routes to prevent conflicts]
router.get('/pending', complaintsController.getPendingComplaints);

router.get('/', complaintsController.getComplaints);
router.get('/:id', complaintsController.getComplaintById);
router.post('/', complaintsController.createComplaint);


module.exports = router;