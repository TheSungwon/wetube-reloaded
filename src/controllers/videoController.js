const fakeUser = {
  username: "user5434",
  loggedIn: false,
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
    views: 345,
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
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");
export const search = (req, res) => res.send("search");
export const deleteVideo = (req, res) => res.send("Delete video");
export const upload = (req, res) => res.send("upload video");
