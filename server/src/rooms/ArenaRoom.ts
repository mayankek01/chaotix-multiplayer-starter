import { BaseRoom, MyRoomState, Player } from "./BaseRoom";

export class ArenaRoomState extends MyRoomState {}

export class ArenaRoom extends BaseRoom<ArenaRoomState> {
  onMessage(client: any, message: { x: number; y: number }) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.x = message.x;
      player.y = message.y;
    }
  }
}