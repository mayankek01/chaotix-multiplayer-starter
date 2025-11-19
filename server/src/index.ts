// server/src/index.ts   ←  THIS IS THE FIXED VERSION (CORS + WebSocket)

import express from "express";
import http from "http";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import cors from "cors";                     // ← ADD THIS
import { ArenaRoom } from "./rooms/ArenaRoom";
import { ShooterRoom } from "./rooms/ShooterRoom";
import { RacingRoom } from "./rooms/RacingRoom";

const app = express();

// THIS IS THE KEY — ENABLE CORS FOR EVERYONE
app.use(cors({
  origin: "*",                         // allow your S3 domain + localhost
  credentials: true
}));

// Optional: serve a tiny health check
app.get("/", (req, res) => res.send("Chaotix multiplayer server OK"));

const server = http.createServer(app);

// Explicitly use WebSocketTransport with CORS
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
    // This makes WebSocket upgrades work with CORS
    verifyClient: (info, cb) => cb(true)
  })
});

// Register rooms
gameServer.define("arena", ArenaRoom);
gameServer.define("shooter", ShooterRoom);
gameServer.define("racing", RacingRoom);

// Start
const PORT = process.env.PORT || 2567;
gameServer.listen(PORT);
console.log(`Chaotix multiplayer server running on port ${PORT}`);