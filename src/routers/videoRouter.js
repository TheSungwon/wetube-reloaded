import express from "express";
import { see, edit, deleteVideo, upload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/", (req, res) => res.send("videos "));
videoRouter.get("/upload", upload);
videoRouter.get("/:id", see);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

//upload를 상단에 놓는 이유는 :id가 먼저 선언 되면 upload가 파라미터로 인식될 수 있다.
//videos/upload --> videos/123
export default videoRouter;
