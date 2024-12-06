const router = require('express').Router();

const authRoutes = require('./auth_routes');

router.use('/auth', authRoutes);

module.exports = router;
