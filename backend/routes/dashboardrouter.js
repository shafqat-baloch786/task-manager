const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const authorization = require('../middelewares/authorization.js');

// Dashboard page
router.get('/dashboard', authorization, dashboardController);


module.exports = router;