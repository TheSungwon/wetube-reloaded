import User from "../models/User";
import Users from "../models/User";
import bcrypt from "bcrypt";

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
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  console.log(username, password);
  // const exists = await User.exists({ username });
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).render("login", {
      pageTitle,
      errorMessage: "An Account With This Username Dose Not Exists.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  //bcrypt 첫번째 arg에 입력한 비번, 두번째는 db비번
  //saltRound는 Hash를 시작 할 때 기억하고 있음.
  console.log(ok);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  console.log("LOG USER IN! COMING SOON!");
  return res.redirect("/");
};

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see user");
