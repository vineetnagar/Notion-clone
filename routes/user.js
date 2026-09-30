const express = require("express");
const userRouter = express.Router();
const { loginUser, createUser } = require("../controllers/user");

userRouter.get("/signup", (req, res) => {
  res.render("signup");
});

userRouter.get("/signin", (req, res) => {
  res.render("signin");
});

userRouter.post("/signin", loginUser);

userRouter.post("/signup", createUser);

userRouter.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});
module.exports = { userRouter };
