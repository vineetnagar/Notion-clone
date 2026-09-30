const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../services/authentication");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedhash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedhash)
      throw new Error("Incorrect password");

    const token = createTokenForUser(user);
    return token;
  },
);
const User = model("user", userSchema);

module.exports = User;
