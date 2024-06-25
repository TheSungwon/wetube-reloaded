import express from "express";
import { see, edit, deleteVideo, upload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/", (req, res) => res.send("videos "));
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload);

//upload를 상단에 놓는 이유는 :id가 먼저 선언 되면 upload가 파라미터로 인식될 수 있다.
//videos/upload --> videos/123
//but, 정규표현식을 사용하면 됨
export default videoRouter;
