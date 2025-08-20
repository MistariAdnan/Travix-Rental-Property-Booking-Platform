const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
const { rendersignupform, successlogout } = require("../controllers/users.js");

router.get("/signup", userController.rendersignupform);

router.post("/signup", wrapAsync(userController.Signup));

router.get("/login", userController.renderloginform);


router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.successlogin);


router.get("/logout", userController.successlogout)

module.exports = router;