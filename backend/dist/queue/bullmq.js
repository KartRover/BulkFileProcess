"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const config_1 = __importDefault(require("../config"));
exports.connection = new ioredis_1.Redis({
    host: config_1.default.REDIS_HOST,
    port: Number(config_1.default.REDIS_PORT),
});
const logProcessingQueue = new bullmq_1.Queue('log-processing-queue', {
    connection: exports.connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
    },
});
const getQueue = () => logProcessingQueue;
exports.getQueue = getQueue;
exports.default = logProcessingQueue;
