const { supabase, supabaseAdmin } = require('../config/db');

class UserRepository {
  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return data;
  }

  // Uses Admin client to bypass RLS if updating profiles via backend logic
  async updateUser(id, updates) {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not configured');
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = new UserRepository();
