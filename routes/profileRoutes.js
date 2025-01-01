const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, upload.single('profileImage'), updateProfile);

module.exports = router;
