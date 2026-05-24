const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

class InterviewEngine {
  /**
   * Start an interview session
   */
  async startSession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .update({ status: 'in_progress', state_json: { startedAt: new Date().toISOString() } })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      logger.info(`Interview session started: ${sessionId}`);
      return data;
    } catch (err) {
      logger.error('Failed to start session', { error: err.message });
      throw err;
    }
  }

  /**
   * End an interview session
   */
  async endSession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .update({ status: 'completed', state_json: { endedAt: new Date().toISOString() } })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      logger.info(`Interview session completed: ${sessionId}`);
      return data;
    } catch (err) {
      logger.error('Failed to end session', { error: err.message });
      throw err;
    }
  }
}

module.exports = new InterviewEngine();
