import express from "express";
import http from "http";
import { Server } from "colyseus";
import { ArenaRoom } from "./rooms/ArenaRoom";
import { ShooterRoom } from "./rooms/ShooterRoom";
import { RacingRoom } from "./rooms/RacingRoom";

const app = express();
const server = http.createServer(app);
const gameServer = new Server({ server });

// Register the 3 room types
gameServer.define("arena", ArenaRoom);
gameServer.define("shooter", ShooterRoom);
gameServer.define("racing", RacingRoom);

const PORT = process.env.PORT || 2567;
gameServer.listen(PORT);
console.log(`Colyseus server running on ws://0.0.0.0:${PORT}`);