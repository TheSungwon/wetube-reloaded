export const localsMiddlewares = (req, res, next) => {
  res.locals.siteName = "WETUBE";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user ? req.session.user : undefined;
  console.log(res.locals);
  next();
};
