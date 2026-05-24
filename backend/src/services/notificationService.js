const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

class NotificationService {
  /**
   * Create an in-app notification
   */
  async createNotification(userId, type, payload) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{ user_id: userId, type, payload }]);

      if (error) throw error;
      
      // Here you would typically emit a socket event to the user's private room
      // global.io.to(`user_${userId}`).emit('notification', { type, payload });
      
      logger.info(`Notification created for user ${userId}`, { type });
      return data;
    } catch (err) {
      logger.error('Failed to create notification', { error: err.message });
      throw err;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAsRead(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null);

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('Failed to mark notifications as read', { error: err.message });
      throw err;
    }
  }
}

module.exports = new NotificationService();
