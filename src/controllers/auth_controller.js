const nodemailer = require('nodemailer');

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

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new Exception('Email is required', 400));

  const user = await User.findOne({ email });

  if (!user) return next(new Exception('No user found', 404));

  const otp = generateOTP();

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.EMAIL_ACCOUNT_ID,
      pass: process.env.EMAIL_ACCOUNT_PASSWORD,
    },
  });

  const result = await transport.sendMail({
    from: process.env.EMAIL_ACCOUNT,
    to: email,
    subject: 'Reset Password',
    text: `Your OTP in order to reset your password is: ${otp}`,
  });

  const isSuccess = result.accepted.length !== 0;

  const date = new Date();
  date.setMinutes(date.getMinutes() + 2);

  // TODO these could be shifted to instance methods instead of here, look into it later on...
  user.otp = otp;
  user.otpReason = 'forget-password';
  user.otpExpires = date;

  await user.save();

  return res.status(isSuccess ? 200 : 400).json({
    status: isSuccess,
    message: isSuccess
      ? 'An Email has been sent your registered email'
      : 'Some error occurred while sending OTP',
  });
});

exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp || otp.length !== 6) {
    return next(new Exception('Email & OTP is required', 400));
  }

  const user = await User.findOne({ email });

  if (!user) return next(new Exception('No user found', 404));

  // most probably an attack or some request mismatch
  if (user.otpReason !== 'forget-password') {
    return next(new Exception('Some error occurred', 400));
  }

  const isValidOTP =
    user.otp === otp &&
    user.otpReason === 'forget-password' &&
    user.otpExpires > Date.now();

  if (!isValidOTP) return next(new Exception('OTP is invalid', 400));

  await user.save();

  const token = authentication.signJWToken(user);

  return res.status(200).json({
    status: true,
    message: 'OTP verified',
    data: token,
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { user } = req;

  if (!password || !confirmPassword || password !== confirmPassword) {
    return next(new Exception('Password & Confirm Password required', 400));
  }

  // most probably an attack or some request mismatch or make sure no duplicate requests are entertained
  if (user.otpReason !== 'forget-password') {
    return next(new Exception('Some error occurred', 400));
  }

  user.password = await authentication.createPasswordHash(password);
  user.otpReason = undefined;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  return res.status(200).json({
    status: true,
    message: 'Password reset successfully',
  });
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

const generateOTP = function (length = 6) {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, length));

  return String(randomNumber).padStart(length, '0');
};
