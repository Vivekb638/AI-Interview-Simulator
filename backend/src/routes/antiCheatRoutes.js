const express = require('express');
const router = express.Router();
const { getSessionCheatingLogs } = require('../controllers/antiCheatController');
const { requireAuth } = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

// Only recruiters/admins can view cheating logs
router.get('/:sessionId', requireAuth, roleGuard(['Recruiter', 'Admin']), getSessionCheatingLogs);

module.exports = router;
