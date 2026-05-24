const judge0Service = require('../services/judge0Service');

exports.execute = async (req, res) => {
  try {
    const { code, language, stdin } = req.body;
    const data = await judge0Service.executeCode(code, language, stdin);
    res.json(data);
  } catch (error) {
    console.error('Execution error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
