const express = require("express");
const routes = express();
const UserController = require("../controller/UserController");
const authenticate = require("../middleware/validation");

routes.get("/myorderList", authenticate.authenticate,UserController.getOrderList);
routes.get("/withproducts", authenticate.authenticate,UserController.getwithProducts);

module.exports = routes;