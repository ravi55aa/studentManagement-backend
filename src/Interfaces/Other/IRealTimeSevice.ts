import { IMessage } from '@Models/ChatModel';

export interface IRealtimeService {
  emitToRoom(roomId: string, event: string, data: IMessage[] | IMessage | null): void;

  sendParallelMsg(roomId: string, event: string, message: string | IMessage): void;
}
