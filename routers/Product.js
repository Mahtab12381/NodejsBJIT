const express = require("express");
const routes = express();
const ProductController = require("../controller/ProductController");
const authenticate = require("../middleware/validation");

routes.get("/all", authenticate.authenticate,ProductController.getAll);
routes.get("/:id", authenticate.authenticate,ProductController.getOne);
routes.post("/create", authenticate.authenticate,authenticate.dataValidation,ProductController.create);
routes.patch("/update", authenticate.authenticate,ProductController.update);
routes.delete("/delete/:id", authenticate.authenticate,ProductController.delete);
routes.get("/sort/stock", authenticate.authenticate,ProductController.sortByStock);
routes.patch("/restore/:id", authenticate.authenticate,ProductController.restore);
routes.patch("/buy/:id/:quantity", authenticate.authenticate,ProductController.buyProduct);

module.exports = routes;