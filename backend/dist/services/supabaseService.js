"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLogStats = exports.getLogStats = exports.storeLogStats = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const storeLogStats = async (logStats) => {
    const { data, error } = await exports.supabase
        .from('log_stats')
        .insert([logStats]);
    if (error) {
        throw new Error(`Error storing log stats: ${error.message}`);
    }
    return data;
};
exports.storeLogStats = storeLogStats;
const getLogStats = async (jobId) => {
    const { data, error } = await exports.supabase
        .from('log_stats')
        .select('*')
        .eq('job_id', jobId);
    if (error) {
        throw new Error(`Error fetching log stats: ${error.message}`);
    }
    return data;
};
exports.getLogStats = getLogStats;
const getAllLogStats = async () => {
    const { data, error } = await exports.supabase
        .from('log_stats')
        .select('*');
    if (error) {
        throw new Error(`Error fetching all log stats: ${error.message}`);
    }
    return data;
};
exports.getAllLogStats = getAllLogStats;
