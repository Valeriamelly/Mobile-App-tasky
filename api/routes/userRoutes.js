const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authenticationController');
const { authenticateUser } = require('../utils/authenticateUser')

router.post('/register', authController.register);
router.get('/verify/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/profile', authenticateUser, userController.getUserProfile);
router.put('/profile', authenticateUser, userController.updateUserProfile);

module.exports = router;
