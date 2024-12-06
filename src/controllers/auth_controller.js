const asyncHandler = require('../utils/async_handler');

exports.login = asyncHandler((req, res, next) => {
  res.status(200).json({});
});

exports.signup = asyncHandler((req, res, next) => {
  res.status(200).json({});
});

exports.updatePassword = asyncHandler((req, res, next) => {
  res.status(200).json({});
});

exports.forgetPassword = asyncHandler((req, res, next) => {
  res.status(200).json({});
});

exports.resetPassword = asyncHandler((req, res, next) => {
  res.status(200).json({});
});

exports.authorize = asyncHandler((req, res, next) => {
  next();
});
