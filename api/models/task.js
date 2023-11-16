// models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }, 
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    userEmail: { // Campo agregado para almacenar el correo electrónico del usuario
        type: String,
        required: true
    }, 
    reminderSent: {
        type: Boolean,
        default: false
    }, 
    isCompleted: {
        type: Boolean,
        default: false // Por defecto, las tareas no están completadas
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;