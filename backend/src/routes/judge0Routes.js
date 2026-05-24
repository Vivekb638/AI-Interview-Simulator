const express = require('express');
const router = express.Router();
const judge0Controller = require('../controllers/judge0Controller');

router.post('/execute', judge0Controller.execute);

module.exports = router;
