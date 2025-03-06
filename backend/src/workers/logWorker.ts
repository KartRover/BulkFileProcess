import { Worker } from 'bullmq';
import { processLogFile } from './logProcessor';
import { connection } from '../queue/bullmq';

const logWorker = new Worker('log-processing-queue', async (job) => {
  await processLogFile(job);
}, {
  connection,
  concurrency: 4, // Set concurrency to 4
});

logWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has been completed`);
});

logWorker.on('failed', (job, err) => {
    if(job){
        console.log(`Job ${job.id} has failed with error ${err.message}`);
    }
});

export default logWorker;