import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
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
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  if (videos) {
    return res.render("home", { pageTitle: "Home", videos });
  } else {
    return res.render("404", { pageTitle: "not found" });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments"); //schema의 ref
  console.log(video);
  // const owner = await User.findById(video.owner); 이렇게도 사용가능 하지만 populate로 대신 사용

  // const video = await Video.findById(id).exec(); exec() 생략가능

  if (video) {
    return res.render("watch", {
      pageTitle: video.title,
      video,
    });
  } else {
    return res.status(404).render("404", { pageTitle: "not found" });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);
  console.log(typeof video.owner, typeof _id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "not found" });
  } else if (String(video.owner) !== String(_id)) {
    //!== 는 생김새 뿐만 아니라 타입도 확인
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/"); //403 means forbidden
  } else {
    return res.render("edit", {
      pageTitle: `EDIT /  ${video.title}`,

      video,
    });
  }
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  // const video = await Video.exists({ _id: id });
  //exists는 argument에 id를 받지않고 filter를 받음.
  //video를 find해서 예외처리보다는 exists로 해결
  console.log(video);

  const {
    user: { _id },
  } = req.session;
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/"); //403 means forbidden
  }

  if (!video) {
    return res.status(404).render("404", { pageTitle: "not found" });
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
      hashtags: Video.formatHashtags(hashtags),
    });

    return res.redirect(`/videos/${id}`);
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  console.log(keyword);
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"), //^는 앞부분이 일치, "i"는 대소문자구분X
        //${keyword}$ 면 뒷부분이 일치, keyword만 적는다면 일부 일치
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search✔", videos });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/"); //403 means forbidden
  }

  if (!video) {
    return res.status(404).render("404", { pageTitle: "not found Id Delete" });
  } else {
    await Video.findByIdAndDelete(id); //findByIdAndRemove는 특별한 이유가 없는한 사용하지 말 것, 이유는 mongoDB는 rollback이 안 되기 떄문.

    await User.findByIdAndUpdate(
      _id,
      {
        $pull: { videos: id },
      },
      {
        new: true,
      }
    );

    return res.redirect("/");
  }
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "upload Video" });

export const postUpload = async (req, res) => {
  // const {user} = req.session;
  // const { path: fileUrl } = req.file;
  // const { title, description, hashtags } = req.body;

  const {
    session: {
      user: { _id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
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
    const newVideo = await Video.create({
      owner: _id,
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      // createdAt: Date.now(),
      hashtags: Video.formatHashtags(hashtags),
      // meta: {
      // views: 0,
      // rating: 0,
      // },
    });

    const user = await User.findById(_id);
    console.log(user, "❤❤❤❤❤");
    user.videos.push(newVideo._id);
    user.save();
    console.log(user, "❤❤❤❤❤");
    return res.redirect("/");
  } catch (error) {
    console.log(`errorrrrrrrrrrrrr, ${error}`);

    return res.status(400).render("upload", {
      pageTitle: "upload Video",
      errorMessage: error._message,
    });
  }
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  //status는 이후에 render() 등을 해야 response
  //sendStatus를 사용
  if (!video) {
    return res.sendStatus(404);
    return res.status(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(202);
  return res.status(202);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404); //sendStatus는 응답을 끝냄, status로 사용하지않도록 주의
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
  return res.sendStatus(201);
};

export const deleteComment = async (req, res) => {
  const { id: videoId } = req.params;
  const { id } = req.body;
  const { user } = req.session;
  console.log(id, videoId, user._id, "ddddddddddddddddddd");

  const ok = await Comment.findOneAndDelete({
    _id: id,
    owner: user,
    video: videoId,
  });
  if (ok === null) {
    return res.sendStatus(404);
  }
  const videoOk = await Video.findByIdAndUpdate(
    { _id: videoId },
    {
      $pull: { comments: id },
    },
    {
      new: true,
    }
  );
  console.log(ok);
  console.log(videoOk);
  return res.sendStatus(200);
};
