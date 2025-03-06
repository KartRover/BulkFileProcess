import { LogEntry } from '../types/logEntry';

export const parseLogLine = (line: string): LogEntry | null => {
    const logPattern = /^\[(.*?)\] (\w+) (.*?)(?: (\{.*\}))?$/;
    const match = line.match(logPattern);

    if (!match) {
        return null;
    }

    const [, timestamp, level, message, jsonPayload] = match;
    return {
        timestamp: new Date(timestamp),
        level,
        message,
        jsonPayload: jsonPayload ? JSON.parse(jsonPayload) : null,
    };
};

export const parseLogFile = (fileContent: string): LogEntry[] => {
    const logLines = fileContent.split('\n');
    return logLines.map(parseLogLine).filter(entry => entry !== null) as LogEntry[];
};