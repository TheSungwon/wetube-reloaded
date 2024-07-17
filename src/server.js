import express from "express";
// const express = require("express"); import와 같은 표현
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";

const app = express();
const logger = morgan("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true })); //form을 사용하기 위한 선언
//express application이 form value를 js로 변환. req.body

app.use(
  session({
    secret: "hello world!",
    resave: true,
    saveUninitialized: true,
  })
); //session 미들웨어가 사이트로 들어오는 모든 것을 기억 함.
app.use((req, res, next) => {
  //   console.log(req.headers);
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
  });
  next();
});

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
