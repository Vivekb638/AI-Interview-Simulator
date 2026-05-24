require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testSignup() {
  const email = `test_${Date.now()}@example.com`;
  console.log(`Trying to sign up with ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: 'password123',
    options: {
      data: {
        full_name: 'Test User',
        role: 'Candidate'
      }
    }
  });
  
  if (error) {
    console.error('Signup Error:', error);
  } else {
    console.log('Signup Success:', data.user.id);
  }
}

testSignup();
