export interface LogEntry {
    timestamp: Date;
    level: string;
    message: string;
    jsonPayload: any | null;
}