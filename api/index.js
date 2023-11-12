const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000; 
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose.connect("mongodb+srv://valefat:valefat@cluster0.3qco7dw.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.log("Error connecting to MongoDb", err);
});

app.listen(port, () => {
    console.log("Server is running on port 8000");
});

const User = require("./models/user");
const Project = require('./models/project'); // Asegúrate de que la ruta sea correcta
const Task = require('./models/task'); // Ajusta la ruta según sea necesario

//funcion para enviar Email al usuario
const sendVerificationEmail = async (email, verificationToken) => {
    //configurar servicio de email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "valeriamelly2410@gmail.com",
            pass: "uhce qohx kwxz rjha",
        },
    });

    //email message
    const mailOptions = {
        from: "task.com",
        to: email,
        subject: "Email Verification",
        text: `Por favor click al siguiente enlace para verificar tu email: http://localhost:8000/verify/${verificationToken}`, 
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verificacion de email enviada exitosamente");
    } catch (error) {
        console.error("Error enviando verificación de email:", error);
    }
};

//endopoint para registrar en la app
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //chequear si el email está ya registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already registered:", email);
            return res.status(400).json({ message: "Email ya registrado" });
        }

        //crear un nuevo usuario
        const newUser = new User({ name, email, password });

        //generar y almacenar la verificacion token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        //guarda usuario en base de datos
        await newUser.save();

        // Debugging statement to verify data
        console.log("New User Registered:", newUser);

        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({
            message:
              "Registration successful. Please check your email for verification.",
          });
    } catch (error) {
        console.log("Error registrando usuario", error);
        res.status(500).json({ message: "Registro fallido" });
    }
});

app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;

        //Encontrar al usuario con la verficación del token dado
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "Verificación del token inválido" });
        }

        //Marcar al usuario como verificado
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({ message: "Email verificado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Verificación del email fallida" });
    }
});

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");

    return secretKey;
}

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      //chequear si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Email o contraseña inválida" });
      }

      //chequear si la contraseña es correcta 
      if (user.password !== password) {
        return res.status(401).json({ error: "Contraseña inválida" });
      }
      
      //se chequea si el correo está verificado
      if (!user.verified) {
        return res.status(401).json({ error: "Verifica tu correo electrónico antes de iniciar sesión"});
      }
  
      //generate a token
      const token = jwt.sign({ userId: user._id }, secretKey);
      
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Login Failed" });
    }
  });

  // Ruta para crear un nuevo proyecto
app.post('/add-project', async (req, res) => {
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
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find(); // Usa el modelo Project para obtener todos los proyectos
        res.status(200).json(projects); // Envía los proyectos como respuesta
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
});

// Ruta para crear una nueva tarea
app.post('/add-task', async (req, res) => {
    try {
        const { name, description, projectId } = req.body;

        // Crear una nueva tarea
        const newTask = new Task({ name, description, projectId });

        // Guardar la tarea en la base de datos
        await newTask.save();

        res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
});
//ruta para obtener las tareas por proyecto 
app.get('/projects/:projectId/tasks', async (req, res) => {
    try {
        //Se utiliza req.params en lugar de req.body porque, en este escenario específico, se espera que el projectId esté en la URL
        const projectId = req.params.projectId;
        const tasks = await Task.find({ projectId: projectId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

// Middleware para autenticación y extraer el ID del usuario
const authenticateUser = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Extrae el token del header, dejando de lado la palabra "Bearer".
      const decoded = jwt.verify(token, secretKey); // Verifica el token usando la clave secreta. La función verify verifica la firma del token con la clave secreta secretKey para asegurarse de que sea válido y no esté alterado.
      req.userId = decoded.userId;// Si el token es válido, se extrae el identificador del usuario (userId) incrustado en el token.
      next();
    } catch (error) {
      res.status(401).json({ message: "Autenticación fallida" });
    }
  };
  
  
// Ruta para obtener el perfil del usuario, utiliza el middleware authenticateUser
app.get('/profile', authenticateUser, async (req, res) => {
    try {
        // req.userId es proporcionado por el middleware authenticateUser
        const user = await User.findById(req.userId).select('-password'); // Excluir la contraseña por seguridad

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Si se encuentra el usuario, devolver los datos (sin incluir la contraseña)
        res.json({ 
            name: user.name,
            email: user.email // y cualquier otro campo que quieras devolver
        });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ message: 'Error al obtener el perfil del usuario.' });
    }
});
  
  // Ruta para actualizar el perfil del usuario
  app.put('/profile', authenticateUser, async (req, res) => {
      // req.userId ya está disponible gracias al middleware authenticateUser
      const { name, password } = req.body;
      
      try {
          // Buscar al usuario por ID
          const user = await User.findById(req.userId);
          if (!user) {
              return res.status(404).json({ message: 'Usuario no encontrado.' });
          }
  
          // Actualizar los campos necesarios
          if (name) user.name = name;
          if (password) {
              //hashear la contraseña antes de guardarla
              user.password = /* función para hashear */(password);
          }
  
          // Guardar el usuario actualizado en la base de datos
          await user.save();
          
          // Enviar una respuesta exitosa
          res.json({ message: 'Perfil actualizado con éxito.' });
      } catch (error) {
          console.error('Error al actualizar el perfil:', error);
          res.status(500).json({ message: 'Error al actualizar el perfil.' });
      }
  });
  
