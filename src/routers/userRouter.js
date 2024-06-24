import express from "express";
import { edit, remove, logout, see } from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/", (req, res) => res.send("users"));
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/logout", logout);
userRouter.get("/:id", see);

export default userRouter;
