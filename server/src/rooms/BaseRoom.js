const { Room } = require("colyseus");
const { Schema, MapSchema } = require("@colyseus/schema");

class Player extends Schema {
  constructor() {
    super();
    this.x = 400;
    this.y = 300;
    this.color = this.getRandomColor();
  }

  getRandomColor() {
    const colors = ["#ff3333","#33ff33","#3333ff","#ffff33","#ff33ff","#33ffff"];
    return colors[Math.floor(Math.random()*6)];
  }
}

class GameState extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
  }
}

class BaseRoom extends Room {
  onCreate() {
    this.setState(new GameState());
    this.maxClients = 10;

    this.onMessage(0, (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        if (data.x !== undefined) player.x = data.x;
        if (data.y !== undefined) player.y = data.y;
      }
    });
  }

  onJoin(client) {
    const player = new Player();
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client) {
    this.state.players.delete(client.sessionId);
  }
}

module.exports = { BaseRoom };