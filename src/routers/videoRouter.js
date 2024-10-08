import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

//mongoDB id는 hexaDecimal String (24글자, 16진수) 0~9, a~f
videoRouter.get("/", (req, res) => res.send("videos "));
videoRouter.get("/:id([0-9a-f]{24})", watch);

// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
//url이 같다면 ~.get ~.post 를 한 줄로 표현 --> ~.route(url) .get() .post()
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);

videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  // .post(videoUpload.single("video"), postUpload);
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );

videoRouter.get("/*", (req, res) => res.render("404"));
//upload를 상단에 놓는 이유는 :id가 먼저 선언 되면 upload가 파라미터로 인식될 수 있다.
//videos/upload --> videos/123
//but, 정규표현식을 사용하면 됨
export default videoRouter;
