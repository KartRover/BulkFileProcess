import next from 'next';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Configure CORS to allow requests from the frontend
  server.use(cors({
    origin: 'http://localhost:3001', // URL of the frontend
    credentials: true,
  }));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = createServer(server);

  httpServer.listen(3000, (err?: any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});