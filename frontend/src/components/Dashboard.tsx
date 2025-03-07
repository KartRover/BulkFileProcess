import React, { useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anonymous key');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Dashboard = () => {
  interface Stat {
    timestamp: string;
    level: string;
    message: string;
    ip: string;
  }
  
  const [stats, setStats] = useState<Stat[]>([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };

    checkUser();

    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('log_stats')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setStats(data);
      }
    };

    fetchStats();
    
    if (!backendUrl) {
      setError('Missing backend URL');
      return;
    }
    const socket = new WebSocket(`${backendUrl.replace(/^http/, 'ws')}/api/live-stats`);

    socket.onmessage = (event) => {
      const newStats = JSON.parse(event.data);
      setStats((prevStats) => [...prevStats, newStats]);
    };

    return () => {
      socket.close();
    };
  }, [router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${backendUrl}/api/upload-logs`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const { jobId } = await response.json();
      console.log('Job ID:', jobId);
    } else {
      setError('Failed to upload file');
    }
    setUploading(false);
  };

  return (
    <div>
      <h1>Log Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="file" onChange={handleFileUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Message</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.timestamp}</td>
              <td>{stat.level}</td>
              <td>{stat.message}</td>
              <td>{stat.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;