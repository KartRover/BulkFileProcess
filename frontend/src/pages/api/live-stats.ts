import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer);

const liveStatsHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    (res.socket as any).server.io = io;
    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.status(200).json({ message: 'WebSocket connection established' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default liveStatsHandler;