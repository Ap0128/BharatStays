const User = require("../models/user");

module.exports.renderSignupForm =  (req, res) => {
  res.render("./user/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to BharatStays");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/users/signup");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("./user/login.ejs");
};

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to BharatStays!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are now logged out");
    res.redirect("/listings");
  });
};