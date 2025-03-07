"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const logProcessor_1 = require("./logProcessor");
const bullmq_2 = require("../queue/bullmq");
const logWorker = new bullmq_1.Worker('log-processing-queue', async (job) => {
    await (0, logProcessor_1.processLogFile)(job);
}, {
    connection: bullmq_2.connection,
    concurrency: 4, // Set concurrency to 4
});
logWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has been completed`);
});
logWorker.on('failed', (job, err) => {
    if (job) {
        console.log(`Job ${job.id} has failed with error ${err.message}`);
    }
});
exports.default = logWorker;
