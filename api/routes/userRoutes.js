const userController=require('../controllers/userController');

module.exports=(app) =>{

    //User login
    app.post("/login", userController.login);
    
    //User registeration 
    app.post("/register", userController.register);

    //User confirma correo
    app.get("/verify/:token", userController.authentication);

  }
