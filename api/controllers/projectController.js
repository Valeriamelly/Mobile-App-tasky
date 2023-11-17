const Project = require('../models/project');


module.exports = {

    // Ruta para crear un nuevo proyecto
    async create(req, res) {
        try {
            const { name, description } = req.body;

            // Crear un nuevo proyecto
            const newProject = new Project({ name, description });

            // Guardar el proyecto en la base de datos
            await newProject.save();

            res.status(201).json({ message: 'Proyecto creado exitosamente', project: newProject });
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
            res.status(500).json({ message: 'Error al crear el proyecto' });
        }
    },

    
    async getAll(req, res) {
        try {
            const projects = await Project.find(); // Usa el modelo Project para obtener todos los proyectos
            res.status(200).json(projects); // Envía los proyectos como respuesta
        } catch (error) {
            console.error('Error al obtener los proyectos:', error);
            res.status(500).json({ message: 'Error al obtener los proyectos' });
        }
    }

}