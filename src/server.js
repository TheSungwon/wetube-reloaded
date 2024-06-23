import express from "express";
// const express = require("express"); import와 같은 표현
import morgan from "morgan";

const PORT = 4000;
const app = express();
const logger = morgan("dev");
app.use(logger);

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT}`);

//
const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");
globalRouter.get("/", handleHome);

const userRouter = express.Router();
const handleEditUser = (req, res) => res.send("edit user");
userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("watch video");
videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, handleListening);
