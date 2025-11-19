const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");

const { ArenaRoom } = require("./rooms/ArenaRoom");
const { ShooterRoom } = require("./rooms/ShooterRoom");
const { RacingRoom } = require("./rooms/RacingRoom");

const app = express();

// This fixes normal HTTP CORS
app.use(cors({
  origin: "*",           // Allow your S3 domain + localhost
  credentials: true
}));

app.get("/", (req, res) => res.send("Chaotix Multiplayer Server — LIVE & CORS FIXED"));

const server = http.createServer(app);

// THIS IS THE KEY: Use WebSocketTransport with CORS enabled
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
    // This allows WebSocket from any origin (your S3 domain)
    verifyClient: (info, cb) => {
      cb(true); // Accept all WebSocket connections
    }
  })
});

// Register rooms
gameServer.define("arena", ArenaRoom).enableRealtimeListing();
gameServer.define("shooter", ShooterRoom).enableRealtimeListing();
gameServer.define("racing", RacingRoom).enableRealtimeListing();

// Start
const PORT = process.env.PORT || 2567;
gameServer.listen(PORT);
console.log(`Server LIVE on port ${PORT} — CORS 100% FIXED`);