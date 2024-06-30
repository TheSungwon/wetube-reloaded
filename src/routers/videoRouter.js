import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/", (req, res) => res.send("videos "));
videoRouter.get("/:id(\\d+)", watch);

// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
//url이 같다면 ~.get ~.post 를 한 줄로 표현 --> ~.route(url) .get() .post()
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

videoRouter.get("/:id(\\d+)/delete", deleteVideo);

videoRouter.route("/upload").get(getUpload).post(postUpload);

//upload를 상단에 놓는 이유는 :id가 먼저 선언 되면 upload가 파라미터로 인식될 수 있다.
//videos/upload --> videos/123
//but, 정규표현식을 사용하면 됨
export default videoRouter;
