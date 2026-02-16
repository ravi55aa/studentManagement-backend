import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {

    io = new Server(server, {
        cors: {
        origin: "*", // change in production
        methods: ["GET", "POST"],
        },
    });

    
    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        const { userId, role } = socket.handshake.auth;

        if (!userId || !role) {
        console.log("Invalid socket auth");
        socket.disconnect();
        return;
        }

        // Join unique room
        socket.join(`${role}-${userId}`);

        console.log(`User joined room: ${role}-${userId}`);

        socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        });
    });

        return io;
};


export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    } 
    
    return io;
};
