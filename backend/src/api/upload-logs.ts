import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseService';
import { getQueue } from '../queue/bullmq';
import { verifyJwt } from '../middleware/authMiddleware';

const uploadLogs = async (req: NextApiRequest, res: NextApiResponse) => {
  verifyJwt(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const file = req.body.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const filePath = `logs/${fileId}.log`;

    // Store the file in Supabase Storage
    const { error: uploadError } = await supabase.storage.from('logs').upload(filePath, file);
    if (uploadError) {
      return res.status(500).json({ message: 'Error uploading file', error: uploadError.message });
    }

    // Calculate file size in bytes
    const fileSize = Buffer.byteLength(file, 'utf8');

    // Set priority based on file size (smaller files get higher priority)
    let priority;
    if (fileSize < 1024 * 1024) { // less than 1MB
      priority = 1;
    } else if (fileSize < 10 * 1024 * 1024) { // 1MB to 10MB
      priority = 2;
    } else { // greater than 10MB
      priority = 3;
    }

    const queue = getQueue();
    await queue.add('log-processing-queue', { fileId, filePath }, { priority, attempts: 3 });

    return res.status(200).json({ jobId: fileId });
  });
};

export default uploadLogs;