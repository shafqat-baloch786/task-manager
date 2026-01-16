const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  completedTasks,
  viewTask,
  deleteTask,
  bulkDeleteTasks,
  editTask,
  toggleComplete,
} = require("../controllers/taskController.js");

const authorization = require("../middelewares/authorization.js");

// View all tasks
router.get("/", authorization, getTasks);

// View completed tasks
router.get("/completed", authorization, completedTasks);

// Create task
router.post("/create", authorization, createTask);

// View single task
router.get("/:id", authorization, viewTask);

// Delete task
router.delete("/:id", authorization, deleteTask);
router.delete("/many/:ids", authorization, bulkDeleteTasks);

// Edit task
router.patch("/:id", authorization, editTask);

// Toggle complete
router.patch("/:id/complete", authorization, toggleComplete);

module.exports = router;
