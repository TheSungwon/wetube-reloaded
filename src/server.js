import express from "express";
// const express = require("express"); import와 같은 표현

const PORT = 4000;
const app = express();

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
