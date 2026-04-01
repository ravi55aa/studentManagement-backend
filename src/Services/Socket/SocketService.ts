import { injectable } from "tsyringe";
import { IRealtimeService } from "@Interfaces/Other/IRealTimeSevice"; 
import { getIO } from "Config/socket.config"; 

@injectable()
export class SocketService implements IRealtimeService {
    emitToRoom(roomId: string, event: string, data: any): void {
        const io = getIO();
        io.to(roomId).emit(event, data);
    }
}