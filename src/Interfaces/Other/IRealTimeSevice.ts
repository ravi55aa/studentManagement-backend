export interface IRealtimeService {
  emitToRoom(roomId: string, event: string, data: Record<string, unknown>): void;
}
