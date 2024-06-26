const fakeUser = {
  username: "user5434",
  loggedIn: false,
};

const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser, videos });
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");
export const search = (req, res) => res.send("search");
export const deleteVideo = (req, res) => res.send("Delete video");
export const upload = (req, res) => res.send("upload video");
