const { supabase } = require('../config/db');

const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user details from public.users table
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If user is not found in public.users, it might be because the trigger hasn't fired yet
      // or the user was just created. We can still return the auth user info.
      return res.status(200).json({
        message: 'Profile not fully synced yet',
        user: req.user
      });
    }

    res.status(200).json({ user: userProfile });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { full_name, bio, location, website, github, linkedin, avatar_url } = req.body;

    // We can update the users table in supabase or auth.users metadata.
    // Let's update auth.users metadata for avatar and github links, etc.
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { full_name, bio, location, website, github, linkedin, avatar_url }
    });

    if (authError) {
      console.warn("Auth meta update failed. You may need to use supabase client directly:", authError);
    }

    // Also update public.users
    const { data: userProfile, error } = await supabase
      .from('users')
      .update({ full_name })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ user: userProfile, message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateMe
};
