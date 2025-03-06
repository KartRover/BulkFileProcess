import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or anonymous key');
  }
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error('Error handling OAuth callback:', error.message);
      } else {
        router.push('/'); // Redirect to the home page or dashboard after successful login
      }
    };

    handleOAuthCallback();
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;