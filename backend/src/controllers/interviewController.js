const { supabase } = require('../config/db');

const createInterview = async (req, res, next) => {
  try {
    const { title, config_json } = req.body;
    const recruiter_id = req.user.id;

    const { data, error } = await supabase
      .from('interviews')
      .insert([{ recruiter_id, title, config_json }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getInterviews = async (req, res, next) => {
  try {
    const recruiter_id = req.user.id;
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('recruiter_id', recruiter_id);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Interview not found' });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById
};
