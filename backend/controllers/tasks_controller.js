const Tasks = require('../models/Tasks.js');

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


module.exports = {
    create_task,
    tasks,
    viewTask,
    deleteTask,
}
