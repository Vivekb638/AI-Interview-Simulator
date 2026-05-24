const express = require('express');
const router = express.Router();
const { getMe, updateMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, getMe);
router.post('/me', requireAuth, updateMe);

module.exports = router;
