import { Server as HttpServer } from 'http';

import { Server } from 'socket.io';
import logger from '@Utils/logger';


let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => { 

        if (!origin) return callback(null, true); 
        
        if (origin.includes("localhost:5173")) { 
            return callback(null, true); 
          } 
          
          return callback(new Error("Not allowed by CORS")); 
        },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });  

  io.on('connection', (socket) => {
    logger.info('User connected:', socket.id);

    const { userId, role } = socket.handshake.auth;

    if (!userId || !role) {
      logger.info('\nInvalid socket auth \n');
      socket.disconnect();
      return;
    }

    // Join unique room
    socket.join(`${role}-${userId}`);

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      logger.info('join chat room',roomId);
    });

    logger.warn(`\n User joined room: ${role}-${userId} \n`);

    socket.on('disconnect', () => {
      logger.info('\nUser disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    logger.error({ layer: 'socket.config.ts', message: 'Socket io not initialized' });
    throw new Error('Socket.io not initialized');
  }

  return io;
};
