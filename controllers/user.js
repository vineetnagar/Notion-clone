const User = require("../modules/user");

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect email or password",
    });
  }
}

async function createUser(req, res) {
  const { userName, email, password } = req.body;
  try {
    const newUser = await User.create({
      userName,
      email,
      password,
    });
    console.log("newUser", newUser);
    res.status(201).redirect("/");
  } catch (error) {
    return res.render("signup", {
      error: "Something went wrong. Please try again.",
    });
  }
}

module.exports = {
  loginUser,
  createUser,
};
