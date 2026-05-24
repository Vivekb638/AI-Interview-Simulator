const axios = require('axios');

const LANGUAGE_MAP = {
  'python': 71,
  'javascript': 63,
  'java': 62,
  'c++': 54,
  'c': 50,
  'go': 60
};

exports.executeCode = async (code, language, stdin = '') => {
  const langId = LANGUAGE_MAP[language?.toLowerCase()];
  if (!langId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const judgeUrl = process.env.JUDGE0_API_URL || 'https://judge1.theeducode.com';
  
  try {
    const response = await axios.post(`${judgeUrl}/submissions?base64_encoded=false&wait=true`, {
      source_code: code,
      language_id: langId,
      stdin: stdin
    });

    return response.data;
  } catch (error) {
    console.error('Judge0 API Error:', error.message);
    throw new Error('Code execution failed');
  }
};
