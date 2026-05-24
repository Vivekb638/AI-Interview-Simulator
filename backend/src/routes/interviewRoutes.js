const express = require('express');
const router = express.Router();
const { createInterview, getInterviews, getInterviewById } = require('../controllers/interviewController');
const { requireAuth } = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

// Only recruiters/admins can create interviews
router.post('/', requireAuth, roleGuard(['Recruiter', 'Admin']), createInterview);
router.get('/', requireAuth, roleGuard(['Recruiter', 'Admin']), getInterviews);

// Anyone authenticated (candidate joining) can get interview details
router.get('/:id', requireAuth, getInterviewById);

module.exports = router;
