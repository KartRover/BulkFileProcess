import { Job } from 'bullmq';
import { supabase } from '../services/supabaseService';
import { parseLogLine } from '../utils/logParser';
import fs from 'fs';

export const processLogFile = async (job: Job) => {
    const { fileId, filePath } = job.data;

    try {
        const logStream = fs.createReadStream(filePath);
        const results: {
            errors: { timestamp: Date; message: string; jsonPayload: any }[];
            keywords: { [key: string]: number };
            ips: { [key: string]: number };
        } = {
            errors: [],
            keywords: {},
            ips: {},
        };

        logStream.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            lines.forEach((line) => {
                const parsed = parseLogLine(line);
                if (parsed) {
                    const { timestamp, level, message, jsonPayload } = parsed;

                    // Track errors
                    if (level === 'ERROR') {
                        results.errors.push({ timestamp, message, jsonPayload });
                    }

                    // Track keywords and IPs
                    if (jsonPayload && jsonPayload.ip) {
                        results.ips[jsonPayload.ip] = (results.ips[jsonPayload.ip] || 0) + 1;
                    }
                }
            });
        });

        logStream.on('end', async () => {
            // Store results in Supabase
            await supabase
                .from('log_stats')
                .insert([
                    {
                        file_id: fileId,
                        errors: results.errors.length,
                        keywords: JSON.stringify(results.keywords),
                        ips: JSON.stringify(results.ips),
                    },
                ]);
        });

        logStream.on('error', (error) => {
            console.error('Error processing log file:', error);
            throw error; // This will trigger BullMQ retry logic
        });
    } catch (error) {
        console.error('Failed to process log file:', error);
        throw error; // This will trigger BullMQ retry logic
    }
};