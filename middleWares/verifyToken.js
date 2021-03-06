const JWT = require("jsonwebtoken");
const User = require("../model/userModel");

module.exports = function (req, res, next) {
  // check if the token in req
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).send("Access denied");

  // verify token
  try {
    const verified = JWT.verify(token, process.env.token_salt);
    //once verified we refresh the token
    if (verified) {
      const tokenClaim = JWT.decode(token, process.env.token_salt);
      const newToken = JWT.sign({ id: tokenClaim._id, name: tokenClaim.name }, process.env.token_salt, {
        expiresIn: 60 * 15
      });
      res.cookie("auth_token", newToken, { httpOnly: true }).send();
      return next();
    }
  } catch (err) {
    res.clearCookie("auth_token");
    res.status(401).send("InValid_Token");
  }
};
