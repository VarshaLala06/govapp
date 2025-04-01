const path = require('path');
const fs = require('fs');
const ngrokUrl = `${process.env.NGROK_URL}`;
const localhostUrl = `http://localhost:${process.env.PORT || 3000}`;

exports.uploadFiles = (req, res) => {
    if (!req.files) {
        console.log('No files to upload');
        return res.status(400).json({message: 'No files uploaded'});
    }
    const fileUrls = req.files.map(file => ({
        // url: `${ngrokUrl || localhostUrl}/uploads/${file.filename}`,
        url: `${ngrokUrl}/uploads/${file.filename}`,
        name: file.originalname,
    }));
    res.status(200).json(fileUrls);
};

exports.serveFile = (req, res) => {
    const filename = req.params.filename;

    // Prevent path traversal by ensuring the filename is a base name
    const safeFilename = path.basename(filename);
    const filePath = path.join(__dirname, '../uploads', safeFilename);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({error: 'File not found'});
        }
        // Serve the file using sendFile
        res.sendFile(filePath);
    });
};