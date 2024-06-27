const fakeUser = {
  username: "user5434",
  loggedIn: true,
};

const videos = [
  {
    title: "first Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 345,
    id: 1,
  },
  {
    title: "second Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 1,
    id: 2,
  },
  {
    title: "third Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 345,
    id: 3,
  },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser, videos });

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", {
    pageTitle: `Watching : ${video.title}`,
    fakeUser,
    video,
  });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("edit", {
    pageTitle: `Editing : ${video.title}`,
    fakeUser,
    video,
  });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const search = (req, res) => res.send("search");
export const deleteVideo = (req, res) => res.send("Delete video");
export const upload = (req, res) => res.send("upload video");
