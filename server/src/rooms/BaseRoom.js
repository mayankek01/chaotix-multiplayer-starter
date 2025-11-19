// server/rooms/BaseRoom.js — PURE JAVASCRIPT (NO TYPESCRIPT DECORATORS)

const { Room } = require("colyseus");

class BaseRoom extends Room {
  onCreate() {
    this.maxClients = 10;

    // Simple state — just a plain object
    this.setState({
      players: {}
    });

    // Auto-delete empty room after 5 min
    this.clock.setTimeout(() => {
      if (this.clients.size === 0) this.disconnect();
    }, 300000);

    // Handle movement
    this.onMessage(0, (client, data) => {
      const player = this.state.players[client.sessionId];
      if (player) {
        if (data.x !== undefined) player.x = data.x;
        if (data.y !== undefined) player.y = data.y;
      }
    });
  }

  onJoin(client) {
    // Create player in the center
    this.state.players[client.sessionId] = {
      x: 400,
      y: 300,
      color: this.getRandomColor()
    };
    console.log(client.sessionId, "joined");
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
    console.log(client.sessionId, "left");
  }

  getRandomColor() {
    const colors = ["#ff3b3b", "#3bff3b", "#3b9bff", "#ffbf3b", "#ff3bff", "#3bffff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = { BaseRoom };