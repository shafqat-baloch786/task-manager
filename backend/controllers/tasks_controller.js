const Tasks = require('../models/Tasks.js');
const mongoose = require('mongoose');

// Creating a new task
const create_task = async (request, response) => {
    try {
        const { title, description, status, priority, dueDate } = request.body;
        if (!title) {
            return response.status(400).json({
                message: "Title is required!"
            });
        }

        // creating and saving to database
        const task = await Tasks.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: request.user.id
        });
        return response.status(201).json({
            task,
            message: "Task saved successfuly!"
        });
    } catch (error) {
        console.log("Error while creating task!", error);
        return response.status(500).json({
            message: "Server error"
        });
    }
}

// Viewing all tasks
const tasks = async (request, response) => {
    try {
        const getTasks = await Tasks.find({ user: request.user.id }).sort({ createdAt: -1 });

        response.status(200).json({
            getTasks,
            message: "All tasks!"
        })
    } catch (error) {
        console.log("Error in tasks!", error);
        return response.json(500).json({
            message: "Server error!"
        })
    }
}

const completedTasks = async (request, response) => {
    try {
        const getTasks = await Tasks.find({ user: request.user.id, isCompleted: true }).sort({ createdAt: -1 });

        response.status(200).json({
            getTasks,
            message: "All tasks!"
        })
    } catch (error) {
        console.log("Error in tasks!", error);
        return response.json(500).json({
            message: "Server error!"
        })
    }
}


// View single task
const viewTask = async (request, response) => {
    try {
        const { id } = await request.params;

        // Validating ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "Invalid task ID!"
            });
        }

        // Finding the exact task that belongs to current logged in user
        const task = await Tasks.findOne({
            _id: id,
            user: request.user.id
        })
        if (!task) {
            return response.status(404).json({
                message: "Task not found!"
            });
        }

        return response.status(200).json({
            task,
            message: "Sinlge task found!"
        });

    } catch (error) {
        console.log("Error in viewing sinlge task!", error);
        return response.status(500).json({
            message: "Server error!"
        })
    }
}

// Deleting a task
const deleteTask = async (request, response) => {
    try {
        const { id } = await request.params;

        // Validating ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "Invalid task ID!"
            });
        }
        // Delete only if task belongs to logged-in user
        const task = await Tasks.findOneAndDelete({
            _id: id,
            user: request.user.id
        });
        if (!task) {
            return response.status(404).json({ message: "Task not found" });
        }

        return response.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleting the task!", error);
        return response.status(500).json({
            message: "Error in deleting the task!"
        })
    }
}

const bulkDeleteTasks = async (request, response) => {
    try {
        const { ids } = await request.params; // EachTask is separated by '&'

        // Filter valid ids only.
        const idsArray = ids.split('&').filter(id => id.match(/^[0-9a-fA-F]{24}$/));

        if (idsArray.length === 0) {
            return response.status(400).json({
                message: "Invalid task IDs!"
            });
        }

        const tasks = await Tasks.deleteMany({
            _id: { $in: idsArray },
            user: request.user.id
        });

        if (tasks.deletedCount === 0) {
            return response.status(404).json({
                message: "No tasks found to delete!"
            });
        }

        return response.status(200).json({
            message: "Tasks deleted successfully!"
        });
    } catch (error) {
        console.log("Error in bulk deleting the tasks!", error);
        return response.status(500).json({
            message: "Error in bulk deleting the tasks!"
        })
    }

}

// Editing/updating a task
const editTask = async (request, response) => {
    try {
        const { id } = request.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(401).json({
                message: "Task id is invalid!"
            });
        }

        if (Object.keys(request.body).length === 0) {
            return response.status(400).json({
                message: "At least one field required!"
            });
        }

        const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
        const updates = {};

        allowedFields.forEach(field => {
            if (request.body[field] !== undefined) {
                updates[field] = request.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return response.status(400).json({
                message: "No valid field provided!"
            });
        }

        const task = await Tasks.findByIdAndUpdate(
            {
                _id: id,
                user: request.user.id,
            },
            {
                $set: updates,
            },
            {
                new: true,
                runValidators: true,
            }
        )

        if (!task) {
            return response.status(404).json({
                message: "Task not found!"
            });
        }
        return response.status(200).json({
            task,
            message: "Task updated!"
        })
    } catch (error) {
        console.log("Error!", error);
        return response.status(500).json({
            message: "Server error!"
        })
    }
}

const toggleComplete = async (request, response) => {
    try {
        const { id } = request.params;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const task = await Tasks.findOne({
                _id: id,
                user: request.user.id,
            });
            if (!task) {
                return response.status(404).json({
                    message: "Task not found!"
                })
            };

            task.isCompleted = !task.isCompleted || false;
            await task.save();
            return response.status(200).json({
                message: "Task toggled!"
            })
        }
        return response.status(400).json({
            message: "Invalid task ID!"
        });
    } catch (error) {
        console.log("Error in toggling task!", error);
        return response.status(500).json({
            message: "Error in toggling task!"
        })
    }
}

module.exports = {
    create_task,
    tasks,
    completedTasks,
    viewTask,
    deleteTask,
    bulkDeleteTasks,
    editTask,
    toggleComplete,
}
