const { supabase } = require('../config/db');

const getSessionCheatingLogs = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('cheating_logs')
      .select('*')
      .eq('session_id', sessionId)
      .order('ts', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessionCheatingLogs
};
