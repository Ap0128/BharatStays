const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

//Sign up
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);

//Log in
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    userController.login
  );

//log out
router.get("/logout", userController.logout);

module.exports = router;
