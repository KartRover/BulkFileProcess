"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLogFile = exports.parseLogLine = void 0;
const parseLogLine = (line) => {
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
exports.parseLogLine = parseLogLine;
const parseLogFile = (fileContent) => {
    const logLines = fileContent.split('\n');
    return logLines.map(exports.parseLogLine).filter(entry => entry !== null);
};
exports.parseLogFile = parseLogFile;
