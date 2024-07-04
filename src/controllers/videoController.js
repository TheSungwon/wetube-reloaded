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
  if (videos) {
    return res.render("home", { pageTitle: "Home", fakeUser, videos });
  } else {
    return res.render("404", { fakeUser, pageTitle: "not found" });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  // const video = await Video.findById(id).exec(); exec() 생략가능

  if (video) {
    return res.render("watch", {
      pageTitle: video.title,
      fakeUser,
      video,
    });
  } else {
    return res.render("404", { fakeUser, pageTitle: "not found" });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { fakeUser, pageTitle: "not found" });
  } else {
    return res.render("edit", {
      pageTitle: `EDIT /  ${video.title}`,
      fakeUser,
      video,
    });
  }
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  // const video = await Video.findById(id);
  const video = await Video.exists({ _id: id });
  //exists는 argument에 id를 받지않고 filter를 받음.
  //video를 find해서 예외처리보다는 exists로 해결
  console.log(video);
  if (!video) {
    return res.render("404", { fakeUser, pageTitle: "not found" });
  } else {
    // video.title = title;
    // video.description = description;
    // video.hashtags = hashtags
    //   .split(",")
    //   .map((word) => (word.startsWith("#") ? word : `#${word}`));
    // await video.save();

    //위 주석처럼 update 도 가능. But
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags,
    });
    return res.redirect(`/videos/${id}`);
  }
};
export const search = (req, res) => res.send("search");
export const deleteVideo = (req, res) => res.send("Delete video");

export const getUpload = (req, res) =>
  res.render("upload", { fakeUser, pageTitle: "upload Video" });

export const postUpload = async (req, res) => {
  console.log(req.body);
  const { title, description, hashtags } = req.body;
  console.log(title, description, hashtags);
  // const video = new Video({
  //   title,
  //   description,
  //   createdAt: Date.now(),
  //   hashtags: hashtags.split(",").map((word) => `#${word}`),
  //   meta: {
  //     views: 0,
  //     rating: 0,
  //   },
  // });
  // await video.save(); 또는 아래와 같이 create로 생성
  try {
    await Video.create({
      title,
      description,
      // createdAt: Date.now(),
      hashtags,
      // meta: {
      // views: 0,
      // rating: 0,
      // },
    });
    return res.redirect("/");
  } catch (error) {
    console.log(`errorrrrrrrrrrrrr, ${error}`);

    return res.render("upload", {
      fakeUser,
      pageTitle: "upload Video",
      errorMessage: error._message,
    });
  }
};
