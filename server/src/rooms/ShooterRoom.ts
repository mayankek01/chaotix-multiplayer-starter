import { BaseRoom, MyRoomState, Player } from "./BaseRoom";
import { type } from "@colyseus/schema";

class ShooterPlayer extends Player {
  @type("number") angle = 0;
}

export class ShooterRoomState extends MyRoomState {
  @type({ map: ShooterPlayer }) players = new MapSchema<ShooterPlayer>();
}

export class ShooterRoom extends BaseRoom<ShooterRoomState> {
  onMessage(client: any, data: { x: number; y: number; angle: number }) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.x = data.x;
      player.y = data.y;
      (player as ShooterPlayer).angle = data.angle;
    }
  }
}