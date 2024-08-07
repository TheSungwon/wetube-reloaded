export const localsMiddlewares = (req, res, next) => {
  res.locals.siteName = "WETUBE";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  console.log(res.locals);
  next();
};
