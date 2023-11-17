const projectController=require('../controllers/projectController');

module.exports=(app) =>{

    //Obtener los proyectos
    app.get('/projects', projectController.getAll);

    //Almacenar los proyectos
    app.post('/add-project', projectController.create);
}

