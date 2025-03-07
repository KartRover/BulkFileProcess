"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLogFile = void 0;
const supabaseService_1 = require("../services/supabaseService");
const logParser_1 = require("../utils/logParser");
const fs_1 = __importDefault(require("fs"));
const processLogFile = async (job) => {
    const { fileId, filePath } = job.data;
    try {
        const logStream = fs_1.default.createReadStream(filePath);
        const results = {
            errors: [],
            keywords: {},
            ips: {},
        };
        logStream.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            lines.forEach((line) => {
                const parsed = (0, logParser_1.parseLogLine)(line);
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
            await supabaseService_1.supabase
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
    }
    catch (error) {
        console.error('Failed to process log file:', error);
        throw error; // This will trigger BullMQ retry logic
    }
};
exports.processLogFile = processLogFile;
