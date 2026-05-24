const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

class ReportService {
  /**
   * Compile summary metrics and logs for a session into a report
   */
  async generateReport(sessionId) {
    try {
      // 1. Fetch all coding submissions for session's assessments
      // 2. Fetch all cheating logs for the session
      // 3. Synthesize summary
      
      const summaryJson = {
        generatedAt: new Date().toISOString(),
        score: Math.floor(Math.random() * 100), // mock
        flags: 0 // mock
      };

      const { data, error } = await supabase
        .from('reports')
        .insert([{ session_id: sessionId, summary_json: summaryJson }]);

      if (error) throw error;
      logger.info(`Report generated for session ${sessionId}`);
      return data;
    } catch (err) {
      logger.error('Failed to generate report', { error: err.message });
      throw err;
    }
  }
}

module.exports = new ReportService();
