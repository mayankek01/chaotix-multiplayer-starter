const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");

const { ArenaRoom } = require("./rooms/ArenaRoom");
const { ShooterRoom } = require("./rooms/ShooterRoom");
const { RacingRoom } = require("./rooms/RacingRoom");

const app = express();
app.use(cors({ origin: "*" }));
app.options("*", cors());

app.get("/", (req, res) => res.send("Chaotix Multiplayer — LIVE & FIXED"));

const server = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
    verifyClient: (info, cb) => cb(true)
  })
});

gameServer.define("arena", ArenaRoom);
gameServer.define("shooter", ShooterRoom);
gameServer.define("racing", RacingRoom);

gameServer.listen(process.env.PORT || 2567);
console.log("Server LIVE — Schema fixed, no errors!");