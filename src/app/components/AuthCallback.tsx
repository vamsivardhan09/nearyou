import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';

/**
 * Handles the redirect back from Supabase magic link emails.
 * Supabase redirects to /auth/callback with tokens in the URL hash.
 * This component exchanges them for a session and sends the user home.
 */
export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // getSession() will automatically pick up the tokens from the URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/home', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#fdfbf8' }}>
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: '#d4a574', borderTopColor: 'transparent' }}
      />
      <p className="text-sm font-light" style={{ color: '#8a7968' }}>Signing you in…</p>
    </div>
  );
}
