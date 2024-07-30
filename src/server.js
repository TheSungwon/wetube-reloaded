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
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/wetube",
    }),
  })
); //session 미들웨어가 사이트로 들어오는 모든 것을 기억 함.

//resave, saveUninitialized
// * resave : 모든 request마다 세션의 변경사항이 있든 없든 세션을 다시 저장한다.
// - true:
// + 스토어에서 세션 만료일자를 업데이트 해주는 기능이 따로 없으면 true로 설정하여 매 request마다 세션을 업데이트 해주게 한다.
// - false:
// + 변경사항이 없음에도 세션을 저장하면 비효율적이므로 동작 효율을 높이기 위해 사용한다.
// + 각각 다른 변경사항을 요구하는 두 가지 request를 동시에 처리할때 세션을 저장하는 과정에서 충돌이 발생할 수 있는데 이를 방지하기위해 사용한다.

// * saveUninitialized : uninitialized 상태인 세션을 저장한다. 여기서 uninitialized 상태인 세션이란 request 때 생성된 이후로 아무런 작업이 가해지지않는 초기상태의 세션을 말한다.
// - true:
// + 클라이언트들이 서버에 방문한 총 횟수를 알고자 할때 사용한다.
// - false:
// + uninitialized 상태인 세션을 강제로 저장하면 내용도 없는 빈 세션이 스토리지에 계속 쌓일수 있다. 이를 방지, 저장공간을 아끼기 위해 사용한다.

//userController에서 session이 수정 될 때 세션을 DB에 저장 -> false일 경우.
//즉 로그인한 사용자에게만 세션 저장.

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
