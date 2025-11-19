const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("colyseus");

const { ArenaRoom } = require("./rooms/ArenaRoom");
const { ShooterRoom } = require("./rooms/ShooterRoom");
const { RacingRoom } = require("./rooms/RacingRoom");

const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("Chaotix Multiplayer Server — LIVE"));

const server = http.createServer(app);
const gameServer = new Server({ server });

// Register rooms
gameServer.define("arena", ArenaRoom).enableRealtimeListing();
gameServer.define("shooter", ShooterRoom).enableRealtimeListing();
gameServer.define("racing", RacingRoom).enableRealtimeListing();

const PORT = process.env.PORT || 2567;
gameServer.listen(PORT);
console.log(`Server running on port ${PORT} — Ready for players!`);