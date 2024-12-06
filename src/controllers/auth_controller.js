const User = require('../models/user');

const Exception = require('../utils/exception');
const asyncHandler = require('../utils/async_handler');

exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return next(
      new Exception('Email, Password & Confirm Password are required')
    );
  }

  if (password !== confirmPassword) {
    return next(new Exception('Password & Confirm Password do not match', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return res.status(201).json({
    status: true,
    data: user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Exception('Email & Password are required', 400));
  }

  const user = await User.findOne({
    email,
    password,
  });

  if (!user) return next(new Exception('No User Found', 404));

  return res.status(200).json({
    status: true,
    data: user,
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  return res.status(200).json({});
});

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  return res.status(200).json({});
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  return res.status(200).json({});
});

exports.authorize = asyncHandler(async (req, res, next) => {
  return next();
});
