
import http from "http";
import { initSocket } from "./Config/socket.config"; 
import { env } from "./Config";
import app from "./app"; //express.server


const server = http.createServer(app);

//export const io=initSocket(server);

const PORT = env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
});