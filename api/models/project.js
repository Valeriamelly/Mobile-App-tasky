const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: { // Agregar esta línea
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
