import { createClient } from '@supabase/supabase-js';
import { LogStats } from '../types/types';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const storeLogStats = async (logStats: LogStats) => {
    const { data, error } = await supabase
        .from('log_stats')
        .insert([logStats]);

    if (error) {
        throw new Error(`Error storing log stats: ${error.message}`);
    }

    return data;
};

export const getLogStats = async (jobId: string) => {
    const { data, error } = await supabase
        .from('log_stats')
        .select('*')
        .eq('job_id', jobId);

    if (error) {
        throw new Error(`Error fetching log stats: ${error.message}`);
    }

    return data;
};

export const getAllLogStats = async () => {
    const { data, error } = await supabase
        .from('log_stats')
        .select('*');

    if (error) {
        throw new Error(`Error fetching all log stats: ${error.message}`);
    }

    return data;
};