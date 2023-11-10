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
    // Puedes agregar más campos según sea necesario
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
