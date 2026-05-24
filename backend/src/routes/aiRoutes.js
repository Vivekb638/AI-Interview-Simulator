const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/transcribe', upload.single('audio'), aiController.transcribe);
router.post('/evaluate', aiController.evaluate);

module.exports = router;
