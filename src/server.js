import express from "express";
// const express = require("express"); import와 같은 표현
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";
import { localsMiddlewares } from "./middlewares";
import MongoStore from "connect-mongo";

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
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/wetube",
    }),
  })
); //session 미들웨어가 사이트로 들어오는 모든 것을 기억 함.

// app.use((req, res, next) => {
//   //   console.log(req.headers);
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//   });
//   next();
// });

app.use(localsMiddlewares); // Add to response locals object middleware
//순서가 중요함. session middleware 다음에 위치.

app.get("/add-one", (req, res, next) => {
  //   console.log("======================", req.session);
  //   req.session.something += 1;
  req.session.sessionIdCheck = req.session.id;
  const check = {
    req: req.session,
    res: res.locals,
  };
  return res.send(check);
});

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
