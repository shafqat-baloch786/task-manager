const {main} = require('../controllers/controllers.js');
const express = require('express');
const app = express();
const Router = express.Router();


Router.route('/').get(main);



module.exports = Router;
