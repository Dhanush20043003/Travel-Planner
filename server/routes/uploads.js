const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, uploadImage); // accepts { image: <base64> } or handle multipart if needed

module.exports = router;
