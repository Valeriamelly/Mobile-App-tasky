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

mongoose.connect("mongodb+srv://chaparro:Miguelyjeni1@cluster0.wibaw6v.mongodb.net/", {
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
        return res.status(401).json({ message: "Email o contraseña inválida" });
      }

      //chequear si la contraseña es correcta 
      if (user.password !== password) {
        return res.status(401).json({ message: "Contraseña inválida" });
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
        // Consulta agregada para obtener los proyectos con las fechas de inicio y fin
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
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
});


// Ruta para crear una nueva tarea
app.post('/add-task', async (req, res) => {
    try {
        const { name, description, projectId, startDate, endDate } = req.body;

        // Crear una nueva tarea con fechas de inicio y fin
        const newTask = new Task({ name, description, projectId, startDate, endDate });

        // Guardar la tarea en la base de datos
        await newTask.save();

        res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
});

app.get('/projects/:projectId/tasks', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const tasks = await Task.find({ projectId: projectId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

app.post('/add-task', async (req, res) => {
    try {
        const { name, description, projectId, startDate, endDate } = req.body;

        // Crear una nueva tarea con fechas de inicio y fin
        const newTask = new Task({ name, description, projectId, startDate, endDate });

        // Guardar la tarea en la base de datos
        await newTask.save();

        res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
});