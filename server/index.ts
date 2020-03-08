import expressSession from "express-session";
import redis from "redis";
import redisStore from "connect-redis";
import express from "express";
import { parse } from "url";
import fs from "fs";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const socket = process.platform !== "win32" && !dev;
const app = next({ dev });
const handle = app.getRequestHandler();

const port_number = 3000;
const sock_path = "/var/run/socks/node.sock";

const session = expressSession({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  store: new (redisStore(expressSession))({
    client: socket
      ? redis.createClient("/var/run/socks/redis.sock")
      : redis.createClient()
  })
});

try {
  fs.unlinkSync(sock_path);
} catch (error) {}

app.prepare().then(() => {
  const server = express();
  server.use(session).use((req, res) => {
    handle(req, res, parse(req.url, true));
  });
  if (socket) {
    server.listen(sock_path, err => {
      if (err) throw err;
      fs.chmodSync(sock_path, "666");
      console.log(`> Ready on unix:${sock_path}`);
    });
  } else {
    server.listen(port_number, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port_number}/`);
    });
  }
});
