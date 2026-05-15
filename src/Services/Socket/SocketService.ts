import { injectable } from 'tsyringe';
import { IRealtimeService } from '@Interfaces/Other/IRealTimeSevice';
import { getIO } from 'Config/socket.config';
import { IMessage } from '@Models/ChatModel';

@injectable()
export class SocketService implements IRealtimeService {
  emitToRoom(roomId: string, event: string, data: IMessage[]): void {
    const io = getIO();
    io.to(roomId).emit(event, data);
  }

  sendParallelMsg(roomId: string, event: string, message: string | IMessage): void {
    const io = getIO();
    io.to(roomId).emit(event, message);
  }
}
