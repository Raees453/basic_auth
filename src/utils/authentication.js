const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signJWToken = function (user) {
  return jwt.sign(
    { id: user.id, username: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.decodeJWToken = function (token) {
  return jwt.decode(token);
};

exports.validatePassword = async function (password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
};

exports.createPasswordHash = async function (password) {
  return bcrypt.hash(password, 10); // salt could be configured using .env as well later on...
};
