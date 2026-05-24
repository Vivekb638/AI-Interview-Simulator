const aiService = require('../services/aiService');
const fs = require('fs');

exports.transcribe = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });
    const data = await aiService.transcribeAudio(req.file.path);
    fs.unlinkSync(req.file.path);
    res.json(data);
  } catch (error) {
    console.error('Transcription error:', error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

exports.evaluate = async (req, res) => {
  try {
    const data = await aiService.evaluateInterview(req.body);
    res.json(data);
  } catch (err) {
    console.error('Evaluation error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
