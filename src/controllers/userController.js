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
  const user = await User.findOne({ username, socialOnly: false }); // github는 password가 없으므로
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

  //login successful -> session에 담기
  req.session.loggedIn = true;
  req.session.user = user;
  console.log("LOG USER IN! COMING SOON!");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";

  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };

  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POSt",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  console.log(tokenRequest, "??????");
  // res.send(JSON.stringify(tokenRequest));

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    console.log(userData);
    console.log("--------------");
    console.log(emailData);
    const email = emailData.find(
      (email) => email.primary === true && email.verified
    ).email;
    console.log(email);
    if (!email) {
      return res.redirect("/login"); // 이메일 없으면 redirect
    }
    const user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ?? userData.login,
        username: userData.login,
        email,
        password: "",
        socialOnly: true,
        location: userData.location ?? "",
      });
    } else {
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  //req.session.user
  //req.body 를 구조분해할당
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file);
  const exists = await User.exists({
    $or: [
      {
        username,
        _id: {
          $ne: _id,
        },
      },
      {
        email,
        _id: {
          $ne: _id,
        },
      },
    ],
  });
  console.log(exists, "-------------");
  if (exists) {
    return res.status(400).send("already username or email exists");
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    {
      new: true,
    }
  );

  req.session.user = updateUser;
  //session은 업데이트 되지 않기 때문에 다시 입력
  // req.session.user = {
  //   ...req.session.user,
  //   name,
  //   email,
  //   username,
  //   location,
  // };

  return res.redirect("/users/edit");
};
export const remove = (req, res) => res.send("remove user");
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const see = (req, res) => res.send("see user");

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    //github 계정은 비밀번호가 없으므로 접근 X
    return res.redirect("/");
  }
  return res.render("user/change-password", { pageTitle: "change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);

  if (!ok) {
    return res.status(400).render("user/change-password", {
      pageTitle: "change password",
      errorMessage: "The current password is incorrect.",
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("user/change-password", {
      pageTitle: "change password",
      errorMessage: "The password does not match the confirmation.",
    });
  }

  user.password = newPassword;
  await user.save();
  //  req.session.user.password = user.password;

  return res.redirect("/users/logout");
};
