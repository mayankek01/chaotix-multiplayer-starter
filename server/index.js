const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");
const { matchMaker } = require("@colyseus/core");  // ← ADD THIS FOR CORS HOOK

const { ArenaRoom } = require("./src/rooms/ArenaRoom");
const { ShooterRoom } = require("./src/rooms/ShooterRoom");
const { RacingRoom } = require("./src/rooms/RacingRoom");

const app = express();

// Standard Express CORS (for /health etc.)
app.use(cors({
  origin: "*",  // Allow games.chaoswale.in + localhost
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight OPTIONS manually (backup for Render)
app.options("*", cors());

app.get("/", (req, res) => res.send("Chaotix Multiplayer — CORS FIXED!"));

const server = http.createServer(app);

// WebSocket transport with open verification
const gameServer = new Server({
  transport: new WebSocketTransport({ server }),
});

// ───────────────────── KEY FIX: Colyseus Matchmaker CORS ─────────────────────
matchMaker.controller.getCorsHeaders = function(req) {
  return {
    "Access-Control-Allow-Origin": "*",  // Or "https://games.chaoswale.in" for security
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };
};

// Register rooms
gameServer.define("arena", ArenaRoom).enableRealtimeListing();
gameServer.define("shooter", ShooterRoom).enableRealtimeListing();
gameServer.define("racing", RacingRoom).enableRealtimeListing();

const PORT = process.env.PORT || 2567;
gameServer.listen(PORT);
console.log(`Server LIVE on ${PORT} — No more CORS!`);