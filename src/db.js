import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
});

// mongoose 6.x 으로 설치하셨을텐데
// useNewUrlParser, userUnifiedTopology 는 기본값이 true로
// useFindAndModify 는 기본값이 false로 되어있다.

const db = mongoose.connection;

const handleOpen = () => console.log("✅ connected to DB");
db.on("err", (err) => console.log("DB Error".error));
db.once("open", handleOpen);
