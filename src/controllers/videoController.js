import Video from "../models/Video";

const fakeUser = {
  username: "user5434",
  loggedIn: true,
};

//mongoose는 더 이상 callback함수를 지원하지 않음. promise로 불러와야함.
//Video.find({}, (error, document) => {}); callback 사용불가

//callback은 return이 되지 않음.
//return은 필수가 아니지만 (function 안 에서) 필요한 function을 불러야함.
//await을 사용하려면 function에 async 선언

// 1. return의 역할 : 본질적인 return의 역할보다는 function을 마무리짓는 역할로 사용되고 있음.
// - 이러한 경우 return이 없어도 정상적으로 동작하지만 실수를 방지하기 위해 return을 사용
// 2. render한 것은 다시 render할 수 없음
// - redirect(), sendStatus(), end() 등등 포함 (express에서 오류 발생)
export const home = async (req, res) => {
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", { pageTitle: "Home", fakeUser, videos });
};

export const watch = (req, res) => {
  const { id } = req.params;

  return res.render("watch", {
    pageTitle: `Watching`,
    fakeUser,
    video,
  });
};

export const getEdit = (req, res) => {
  const { id } = req.params;

  return res.render("edit", {
    pageTitle: `Editing`,
    fakeUser,
    video,
  });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  return res.redirect(`/videos/${id}`);
};
export const search = (req, res) => res.send("search");
export const deleteVideo = (req, res) => res.send("Delete video");

export const getUpload = (req, res) =>
  res.render("upload", { fakeUser, pageTitle: "upload Video" });

export const postUpload = (req, res) => {
  console.log(req.body);
  const { title } = req.body;

  return res.redirect("/");
};
