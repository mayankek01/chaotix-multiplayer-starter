const { Room } = require("colyseus");
const { Schema, MapSchema, type } = require("@colyseus/schema");

class Player extends Schema {
  @type("number") x = 400;  
  @type("number") y = 300;   
  @type("string") color = "#ff0000";
  @type("number") angle = 0;
}

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema();
}

class BaseRoom extends Room {
  onCreate() {
    this.setState(new GameState());
    this.maxClients = 10;

    // Auto-delete empty room after 5 minutes
    this.clock.setTimeout(() => {
      if (this.clients.size === 0) this.disconnect();
    }, 300000);

    this.onMessage(0, (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        if (data.x !== undefined) player.x = data.x;
        if (data.y !== undefined) player.y = data.y;
        if (data.angle !== undefined) player.angle = data.angle;
      }
    });
  }

  onJoin(client) {
    const player = new Player();
    player.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client) {
    this.state.players.delete(client.sessionId);
  }
}

module.exports = { BaseRoom };