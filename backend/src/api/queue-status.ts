import { NextApiRequest, NextApiResponse } from 'next';
import { Queue } from 'bullmq';
import { getQueue } from '../queue/bullmq';

const queue: Queue = getQueue();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const queueStatus = await queue.getJobCounts();
            res.status(200).json(queueStatus);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch queue status' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}