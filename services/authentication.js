const JWT = require("jsonwebtoken");
const secret = "YOYOHoney@singh1983";

function createTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    userName: user.userName,
  };

  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
