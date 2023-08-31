const express = require("express");
const app = express();
const ProductRouter = require("./routers/Product");
const authRouter = require("./routers/Auth");
const userRouter = require("./routers/User");
const {failure} = require('./utility/common');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/products", ProductRouter);
app.use("/user", userRouter);

app.use((req, res) => {
    res.status(404).send(failure("Page Not Found"));
  });

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
})
