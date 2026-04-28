require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Interview Backend is running' });
});

// AI Setup Proxies
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

// STT: Proxy Audio Transcription to Python Microservice
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });
    
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(req.file.path), {
      filename: 'speech.webm',
      contentType: 'audio/webm'
    });

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const pyRes = await axios.post(`${pythonServiceUrl}/api/transcribe`, formData, {
      headers: formData.getHeaders()
    });

    fs.unlinkSync(req.file.path); // Clean up
    res.json(pyRes.data);
  } catch (error) {
    console.error('Transcription proxy error:', error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

// AI Evaluation Route Proxied to Python
app.post('/api/evaluate', async (req, res) => {
  try {
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const pyRes = await axios.post(`${pythonServiceUrl}/api/evaluate`, req.body);
    res.json(pyRes.data);
  } catch (err) {
    console.error('Evaluation proxy error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Judge0 Code Execution Route
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language, stdin } = req.body;
    
    // Map language to Judge0 ID (approximations common to Judge0 CE)
    const langMap = {
      javascript: 63,
      python: 71,
      cpp: 54,
      java: 62
    };

    const judge0Url = process.env.JUDGE0_API_URL;
    if (!judge0Url) {
      return res.status(500).json({ error: 'Judge0 URL not configured' });
    }

    const payload = {
      source_code: code,
      language_id: langMap[language] || 63,
      stdin: stdin || ""
    };

    const runRes = await axios.post(`${judge0Url}/submissions/?base64_encoded=false&wait=true`, payload);
    
    // Pass the entire response back to the frontend
    res.json(runRes.data);
  } catch (error) {
    console.error('Judge0 execution failed:', error?.response?.data || error.message);
    res.status(500).json({ 
      error: 'Code execution failed', 
      details: error?.response?.data?.message || error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
