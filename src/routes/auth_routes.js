const router = require('express').Router();
const authController = require('../controllers/auth_controller');

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);
router.route('/forget-password').post(authController.forgetPassword);
router.route('/verify-otp').post(authController.verifyOTP);

router.use(authController.authorize);

router.route('/reset-password').post(authController.resetPassword);
router.route('/update-password').post(authController.updatePassword);

module.exports = router;
