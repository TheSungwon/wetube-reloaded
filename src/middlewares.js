import multer from "multer";

export const localsMiddlewares = (req, res, next) => {
  res.locals.siteName = "WETUBE";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  // console.log(res.locals);
  next();
};

//로그인해야만 접근할 수 있게
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Log in first");
    return res.redirect("/login");
  }

  // req.session.loggedIn ? next() : res.redirect("/login");
};

//로그인 안 해야 접근할 수 있게
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not Authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 30000000,
  },
});
