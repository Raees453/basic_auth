const authController = require('../controllers/auth_controller');
const router = require('express').Router();

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);
router.route('/forget-password').post(authController.signup);
router.route('/reset-password').post(authController.signup);

router
  .route('/update-password')
  .post(authController.authorize, authController.signup);

module.exports = router;
