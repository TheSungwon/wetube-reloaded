import express from "express";
import { watch, edit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/", (req, res) => res.send("videos"));
videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);

export default videoRouter;
