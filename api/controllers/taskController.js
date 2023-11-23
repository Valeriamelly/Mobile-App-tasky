const Project = require('../models/project');
const Task = require('../models/task');


exports.createTask = async (req, res) => {
    try {
        const { name, description, projectId, startDate, endDate, userEmail } = req.body;

        // Crear una nueva tarea con fechas de inicio y fin y correo electrónico del usuario
        const newTask = new Task({ name, description, projectId, startDate, endDate, userEmail });

        // Guardar la tarea en la base de datos
        await newTask.save();

        res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
};

exports.getTasksByProjectId = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Buscar el proyecto por su ID para obtener el nombre
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        const tasks = await Task.find({ projectId: projectId });

        // Envía las tareas y el nombre del proyecto
        res.status(200).json({ tasks: tasks, projectName: project.name });
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { isCompleted } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(taskId, { isCompleted }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
};


/*
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json({ message: 'Tarea eliminada exitosamente', deletedTask });
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
};
*/