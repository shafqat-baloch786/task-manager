const express = require('express');
const router = express.Router(); // lowercase by convention
const { create_task, tasks, viewTask, deleteTask } = require('../controllers/tasks_controller.js');
const authorization = require('../middelewares/authorization.js');

// Tasks base route to view all tasks related to current logged in user
router.get('/', authorization, tasks);

// Creating task
router.post('/create', authorization, create_task);

// View single task
router.get('/:id', authorization, viewTask);

// Deleting task
router.delete('/:id', authorization, deleteTask);

module.exports = router;
