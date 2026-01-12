const express = require('express');
const router = express.Router(); // lowercase by convention
const { create_task, tasks, viewTask, deleteTask, editTask, bulkDeleteTasks, completeTask,getCompletedTasks, uncompleteTask} = require('../controllers/tasks_controller.js');
const authorization = require('../middelewares/authorization.js');

// Get completed tasks
router.get('/completed', authorization, getCompletedTasks);

// Mark task as completed
router.patch('/:id/complete', authorization, completeTask);

// Mark task as uncompleted
router.patch('/:id/uncomplete', authorization, uncompleteTask);

// Tasks base route to view all tasks related to current logged in user
router.get('/', authorization, tasks);

// Creating task
router.post('/create', authorization, create_task);

// View single task
router.get('/:id', authorization, viewTask);

// Deleting task
router.delete('/:id', authorization, deleteTask);
router.delete('/many/:ids', authorization, bulkDeleteTasks);

// Editing/updating task
router.patch('/:id', authorization, editTask);


module.exports = router;
