import express from "express";
// const express = require("express"); import와 같은 표현

const PORT = 4000;
const app = express();

const handleHome = (req, res) => {
  return res.send("home send");
};
const handleLogin = (req, res) => {
  return res.send("login send");
};

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT}`);

app.get("/", handleHome);
app.get("/login", handleLogin);
app.listen(4000, handleListening);
