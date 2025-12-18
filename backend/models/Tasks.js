const mongoose = require('mongoose');


// Task schema containing all fields
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,

        },
    },
    // Adding timestamp automatically
    { timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema);