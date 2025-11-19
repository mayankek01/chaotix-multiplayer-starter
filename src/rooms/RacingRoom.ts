import { BaseRoom, MyRoomState, Player } from "./BaseRoom";

export class RacingRoom extends BaseRoom<MyRoomState> {
  onMessage(client: any, data: { x: number; y: number }) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.x = data.x;
      player.y = data.y;
    }
  }
}