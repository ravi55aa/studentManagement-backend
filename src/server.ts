
import http from "http";
import { initSocket } from "./Config/socket.config"; 
import { env } from "./Config";
import app from "./app"; //express.server


const server = http.createServer(app);

// Initialize socket
const io = initSocket(server); 

const PORT = env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
});