const problems = require('../data/problems.json');

exports.getAllProblems = (req, res) => {
  try {
    // Return summary without full descriptions and starter code
    const summary = problems.map(p => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category
    }));
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProblemById = (req, res) => {
  try {
    const { id } = req.params;
    const problem = problems.find(p => p.id === id);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    // For the UI, we don't send the expected output or hidden test cases, 
    // but since we are doing client-side proxying for execution in Phase 2, we can send them.
    // In a real production system, testCases would be hidden.
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
