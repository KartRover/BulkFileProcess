export interface LogStats {
    job_id: string;
    timestamp: string;
    level: string;
    message: string;
    payload?: Record<string, any>;
    error_count: number;
    keyword_count: number;
    ip_count: number;
}