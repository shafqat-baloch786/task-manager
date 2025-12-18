const express = require('express');
const app = express();
const Router = express.Router();
const { register, login } = require('../controllers/auth_controller.js');

Router.route('/register').post(register);
Router.route('/login').post(login);


module.exports = Router