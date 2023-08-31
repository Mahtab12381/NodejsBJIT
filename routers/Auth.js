const express = require("express");
const routes = express();
const LoginController = require("../controller/AuthController");
const authenticate = require("../middleware/validation");

routes.post("/login", LoginController.login);
routes.patch("/logout",authenticate.authenticate,LoginController.logout);
routes.post("/signup", LoginController.signup);
routes.post("/sendotp", LoginController.forgotpassword);
routes.patch("/resetpassword", LoginController.resetpassword);

module.exports = routes;
