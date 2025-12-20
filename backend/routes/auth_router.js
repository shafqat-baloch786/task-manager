const express = require('express');
const app = express();
const router = express.Router();
const { register, login, editUser, forgotPassword, resetPassword } = require('../controllers/auth_controller.js');
const authorization = require('../middelewares/authorization.js');

// Register user
// Router.route('/register').post(register);

router.post('/register', register);

// Login user
// Router.route('/login').post(login);
router.post('/login', login);

// Edit user
// router.patch(authorization, editUser);
router.patch('/update-profile', authorization, editUser);

// Edit password
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);



module.exports = router