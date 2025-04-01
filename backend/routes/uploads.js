const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const uploadsController = require('../controllers/uploadsController');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
console.log('Uploads directory created', uploadDir, uploadDir.toString());

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/upload', upload.array('files'), uploadsController.uploadFiles);
router.get('/:filename', uploadsController.serveFile);

module.exports = router;