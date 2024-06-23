import express from "express";
// const express = require("express"); import와 같은 표현
import morgan from "morgan";

const PORT = 4000;
const app = express();
const logger = morgan("dev");

// const logger = (req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// };

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  console.log(url.includes("protected"));
  if (url === "/protected") {
    return res.send("<h1> NOT ALLOWED </h1>");
  }
  console.log("Allowed, You May Continue.");
  next();
};

const handleHome = (req, res) => {
  return res.send("home send");
};
const handleLogin = (req, res) => {
  return res.send("login send");
};
const handleProtected = (req, res) => {
  return res.send("Welcome to the Private Lounge");
};

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT}`);

// app.get("/", middleware, handleHome);

app.use(logger);
app.use(privateMiddleware);
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);
app.listen(4000, handleListening);
