import "reflect-metadata";

import http from "http";
import { initSocket } from "./Config/socket.config"; 
import { env } from "./Config";
import app from "./app"; //express.server
import logger from "./Utils/logger";


const server = http.createServer(app);

//export const io=initSocket(server);

const PORT = env.PORT || 5000;

server.listen(PORT,()=>{
    logger.info(`http://localhost:${PORT}`);
});