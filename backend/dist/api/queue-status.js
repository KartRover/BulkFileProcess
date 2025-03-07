"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const bullmq_1 = require("../queue/bullmq");
const queue = (0, bullmq_1.getQueue)();
async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const queueStatus = await queue.getJobCounts();
            res.status(200).json(queueStatus);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch queue status' });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
