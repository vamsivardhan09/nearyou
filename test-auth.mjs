import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kdaufaqkyfkllvxinjhv.supabase.co',
  'sb_publishable_sm1yxyUVe4LrazWJzEj-Zw_zLm1s8CZ'
);

async function testAuth() {
  const fakeEmail = '9876543210@demo.celebratenear.com';
  const fakePassword = 'demo_9876543210_secret';

  console.log('Attempting sign in...');
  let authResult = await supabase.auth.signInWithPassword({
    email: fakeEmail,
    password: fakePassword,
  });

  if (authResult.error) {
    console.log('Sign in failed:', authResult.error.message);
    console.log('Attempting sign up...');
    authResult = await supabase.auth.signUp({
      email: fakeEmail,
      password: fakePassword,
    });
    
    if (authResult.error) {
       console.log('Sign up failed:', authResult.error.message);
       return;
    }
  }

  console.log('Auth successful!');
  console.log('User ID:', authResult.data?.user?.id);
  console.log('Session exists:', !!authResult.data?.session);

  console.log('Attempting upsert...');
  const { data, error } = await supabase.from('users').upsert({
    id: authResult.data?.user?.id,
    full_name: 'Test User',
    phone: '9876543210'
  });
  if (error) console.log('Upsert failed:', error.message);
  else console.log('Upsert successful!');
}

testAuth();
