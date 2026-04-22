export interface IRealtimeService {
  emitToRoom(roomId: string, event: string, data: any): void;
}
