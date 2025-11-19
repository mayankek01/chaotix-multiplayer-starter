import { Room, Client } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x = 400;
  @type("number") y = 300;
  @type("string") color = "#ff0000";
  @type("string") name = "Player";
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export abstract class BaseRoom<T extends MyRoomState> extends Room<T> {
  maxClients = 8;

  onCreate() {
    this.setState(new MyRoomState() as T);

    // Broadcast every 16ms (60fps)
    this.clock.setInterval(() => {
      this.broadcastPatch();
    }, 1000 / 60);
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined", this.roomName);
    const player = new Player();
    player.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    player.name = `P${this.clients.length}`;
    (this.state.players as MapSchema<Player>).set(client.sessionId, player);
  }

  onLeave(client: Client) {
    (this.state.players as MapSchema<Player>).delete(client.sessionId);
  }
}