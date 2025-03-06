import { config } from 'dotenv';

config();

const REDIS_PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export default {
  REDIS_PORT,
  REDIS_HOST,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};