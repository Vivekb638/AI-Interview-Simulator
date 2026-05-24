const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

class AnalyticsService {
  /**
   * Log a metric for a user
   * @param {string} userId 
   * @param {string} metricName 
   * @param {number} value 
   */
  async logMetric(userId, metricName, value) {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .insert([{ user_id: userId, metric_name: metricName, value }]);
      
      if (error) throw error;
      logger.info(`Metric logged for user ${userId}: ${metricName}=${value}`);
      return data;
    } catch (err) {
      logger.error('Error logging metric', { error: err.message });
      throw err;
    }
  }

  /**
   * Get metrics for a specific user
   */
  async getUserMetrics(userId) {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .order('ts', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('Error fetching user metrics', { error: err.message });
      throw err;
    }
  }
}

module.exports = new AnalyticsService();
