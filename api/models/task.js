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
    
    // Puedes agregar más campos según sea necesario
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;