import User from "../models/User";
import Users from "../models/User";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "create Account" });

export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";

  if (password !== password2) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Password confirmation dose not match.",
    });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] }); //username, email 2개중 or조건으로 유니크인지 검색함
  if (exists) {
    res.render("join", {
      pageTitle,
      errorMessage: "This Username Or Email is Already Taken.",
    });
  } else {
    await Users.create({ name, email, username, password, location });
    return res.redirect("/login");
  }
};
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see user");
