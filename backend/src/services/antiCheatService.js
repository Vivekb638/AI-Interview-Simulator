const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

class AntiCheatService {
  /**
   * Analyze an incoming cheat event and assign a severity
   * @param {Object} eventData
   */
  async processEvent(sessionId, eventType, metadata = {}) {
    let severity = 'low';

    // Basic rules engine for severity
    if (eventType === 'tab_switch' || eventType === 'blur') {
      severity = 'medium';
    } else if (eventType === 'copy_paste' || eventType === 'right_click') {
      severity = 'high';
    } else if (eventType === 'multiple_faces_detected' || eventType === 'no_face_detected') {
      severity = 'critical';
    }

    try {
      const { data, error } = await supabase
        .from('cheating_logs')
        .insert([{ 
          session_id: sessionId, 
          event_type: eventType, 
          severity: severity 
        }]);

      if (error) throw error;
      
      logger.warn(`Anti-cheat violation recorded [${severity}]`, { sessionId, eventType });
      
      return { severity, eventType };
    } catch (err) {
      logger.error('Failed to log cheating event', { error: err.message });
      throw err;
    }
  }
}

module.exports = new AntiCheatService();
