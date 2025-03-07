"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const supabaseService_1 = require("../services/supabaseService");
const bullmq_1 = require("../queue/bullmq");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadLogs = async (req, res) => {
    (0, authMiddleware_1.verifyJwt)(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }
        const file = req.body.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileId = (0, uuid_1.v4)();
        const filePath = `logs/${fileId}.log`;
        // Store the file in Supabase Storage
        const { error: uploadError } = await supabaseService_1.supabase.storage.from('logs').upload(filePath, file);
        if (uploadError) {
            return res.status(500).json({ message: 'Error uploading file', error: uploadError.message });
        }
        // Calculate file size in bytes
        const fileSize = Buffer.byteLength(file, 'utf8');
        // Set priority based on file size (smaller files get higher priority)
        let priority;
        if (fileSize < 1024 * 1024) { // less than 1MB
            priority = 1;
        }
        else if (fileSize < 10 * 1024 * 1024) { // 1MB to 10MB
            priority = 2;
        }
        else { // greater than 10MB
            priority = 3;
        }
        const queue = (0, bullmq_1.getQueue)();
        await queue.add('log-processing-queue', { fileId, filePath }, { priority, attempts: 3 });
        return res.status(200).json({ jobId: fileId });
    });
};
exports.default = uploadLogs;
