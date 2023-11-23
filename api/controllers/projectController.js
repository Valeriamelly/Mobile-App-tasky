const Project = require('../models/project');

exports.createProject = async (req, res) => {
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
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.aggregate([
            {
                $lookup: {
                    from: 'tasks', // Asegúrate de que el nombre de la colección sea correcto
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'tasks'
                }
            },
            {
                $addFields: {
                    startDate: { $min: "$tasks.startDate" },
                    endDate: { $max: "$tasks.endDate" }
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    startDate: 1,
                    endDate: 1
                }
            }
        ]);        
        res.status(200).json(projects); // Envía los proyectos como respuesta
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
};