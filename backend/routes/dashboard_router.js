const express = require('express');
const Router = express.Router();
const dashboard_controller = require('../controllers/dashboard_controller.js');
const authorization = require('../middelewares/authorization.js');


Router.route('/dashboard').get(authorization, dashboard_controller);


module.exports = Router;