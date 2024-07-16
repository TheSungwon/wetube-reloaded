import User from "../models/User";
import Users from "../models/User";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "create Account" });

export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation dose not match.",
    });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] }); //username, email 2개중 or조건으로 유니크인지 검색함
  if (exists) {
    res.status(400).render("join", {
      pageTitle,
      errorMessage: "This Username Or Email is Already Taken.",
    });
  } else {
    try {
      await Users.create({ name, email, username, password, location });
      return res.redirect("/login");
    } catch (error) {
      return res.status(400).render("join", {
        pageTitle: "create a User Error",
        errorMessage: error._message,
      });
    }
  }
};
export const getLogin = (req, res) => res.render("login");
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const exists = await User.exists({ username });
  if (!exists) {
    return res
      .status(404)
      .render("login", {
        pageTitle: "login error",
        errorMessage: "An Account With This Username Dose Not Exists.",
      });
  }

  return res.render("login");
  // return res.end();
};

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see user");
