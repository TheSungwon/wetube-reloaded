import express from "express";
import {
  getEdit,
  postEdit,
  remove,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/", (req, res) => res.send("users"));
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/remove", remove);
userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)", see);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
