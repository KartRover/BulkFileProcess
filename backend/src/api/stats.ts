import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import config from '../config';
import { verifyJwt } from '../middleware/authMiddleware';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  verifyJwt(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const { jobId } = req.query;

        let query = supabase.from('log_stats').select('*');

        if (jobId) {
          query = query.eq('job_id', jobId);
        }

        const { data, error } = await query;

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  })
};