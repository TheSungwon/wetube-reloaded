import Video from "../models/Video";

const fakeUser = {
  username: "user5434",
  loggedIn: true,
};

//mongoose는 더 이상 callback함수를 지원하지 않음. promise로 불러와야함.
//Video.find({}, (error, document) => {}); callback 사용불가

//await을 사용하려면 function에 async 선언
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
