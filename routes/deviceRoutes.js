const express = require('express');
const router = express.Router();
const { getDevices, logoutFromDevice } = require('../controllers/deviceController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, getDevices);
router.post('/logout', authenticateToken, logoutFromDevice);


module.exports = router;
