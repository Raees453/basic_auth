const User = require('../models/user');
const Exception = require('../utils/exception');
const authentication = require('../utils/authentication');
const asyncHandler = require('../utils/async_handler');

exports.signup = asyncHandler(async (req, res, next) => {
  let { name, email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return next(
      new Exception('Email, Password & Confirm Password are required', 400)
    );
  }

  if (password !== confirmPassword) {
    return next(new Exception('Password & Confirm Password do not match', 400));
  }

  password = await authentication.createPasswordHash(password);

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

  const user = await User.findOne({ email });

  if (!user || !user.password) {
    return next(new Exception('Invalid Credentials Provided', 404));
  }

  const isPasswordSame = await authentication.validatePassword(
    password,
    user.password
  );

  if (!isPasswordSame) {
    return next(new Exception('Invalid Credentials Provided', 404));
  }

  const token = authentication.signJWToken(user);

  return res.status(200).json({
    status: true,
    data: { user, token },
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(
      new Exception('Current, New & Confirm New Password required', 400)
    );
  }

  if (newPassword !== confirmNewPassword) {
    return next(new Exception('New & Confirm New Passwords do not match', 400));
  }

  const isPasswordSame = await authentication.validatePassword(
    currentPassword,
    user.password
  );

  if (!isPasswordSame) {
    return next(new Exception('Invalid Current Password Provided', 400));
  }

  user.password = await authentication.createPasswordHash(newPassword);

  await user.save();

  res.status(200).json({
    status: true,
    message: 'Password updated successfully',
  });
});

exports.forgetPassword = asyncHandler(async (req, res) => {
  return res.status(200).json({});
});

exports.resetPassword = asyncHandler(async (req, res) => {
  return res.status(200).json({});
});

exports.authorize = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return next(new Exception('Please login to access', 401));
  }

  const data = authentication.decodeJWToken(token.replace('Bearer ', ''));

  if (!data) return next(new Exception('Invalid JWT Provided', 400));

  const issueDate = new Date(data.iat);
  const expireDate = new Date(data.exp);

  // how could I test this out effectively?
  if (expireDate <= issueDate) {
    return next(new Exception('Invalid JWT Provided', 401));
  }

  const user = await User.findById(data.id);

  if (!user) return next(new Exception('No User Found', 404));

  req.user = user;

  next();
});
