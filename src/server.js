const Express = require("express");
const { parse } = require("url");
const next = require("next");
const session = require("express-session");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const express = Express();

express.use(
  session({
    secret: "nextjs",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, maxAge: 1000 * 60 * 30 }
  })
);

app.prepare().then(() => {

  express
    .use((req, res) => {
      console.log(req.session)
      req.session.test = req.session.test?req.session.test+1:1
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
});
