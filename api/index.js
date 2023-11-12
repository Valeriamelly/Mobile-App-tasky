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
            user: "grupitogpt4@gmail.com",
            pass: "khog vovx kkey blhf",
        },
    });

    //email message
    const mailOptions = {
        from: '"Tasky G2" <grupitogpt4@gmail.com>', 
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

        // Chequear si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email o contraseña inválida" });
        }

        // Chequear si la contraseña es correcta 
        if (user.password !== password) {
            return res.status(401).json({ message: "Contraseña inválida" });
        }

        // Chequear si el correo está verificado
        if (!user.verified) {
            return res.status(401).json({ error: "Verifica tu correo electrónico antes de iniciar sesión" });
        }

        // Generar un token
        const token = jwt.sign({ userId: user._id }, secretKey);

        // Devolver el token y el correo electrónico en la respuesta
        res.status(200).json({ token, userEmail: user.email });
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
});

app.get('/projects/:projectId/tasks', async (req, res) => {
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
});


//Función para enviar recordatorios
const enviarRecordatorioTarea = async (tarea) => {
    console.log("estoy aqui");
    const horaActual = new Date();
    const horaFinTarea = new Date(tarea.endDate);

    // Si la tarea ya está completada, no enviar recordatorio
    if (tarea.isCompleted) return;
     
    // Calcula la diferencia en milisegundos
    const diferencia = horaFinTarea.getTime() - horaActual.getTime();

    // Si la diferencia es menor o igual a una hora
    if (diferencia <= 3600000) {
        // Envía el correo electrónico
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "grupitogpt4@gmail.com",
                pass: "khog vovx kkey blhf",
            },
        });

        const mailOptions = {
            from: '"Tasky G2" <grupitogpt4@gmail.com>', // Nombre personalizado y dirección de correo
            to: tarea.userEmail, // Asegúrate de que 'userEmail' sea un campo en tu modelo de tarea
            subject: "Recordatorio de Tarea Próxima a Vencer",
            text: `Hola! Solo un recordatorio de que tu tarea "${tarea.name}" está programada para terminar en una hora.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Recordatorio de tarea enviado exitosamente");
        } catch (error) {
            console.error("Error enviando recordatorio de tarea:", error);
        }
    }
};

const cron = require('node-cron');
const moment = require('moment');

cron.schedule('* * * * *', async () => {
    console.log('Verificando tareas para enviar recordatorios...');
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));


    // Encuentra tareas que terminen exactamente dentro de una hora y aún no se haya enviado un recordatorio
    const tareas = await Task.find({
        isCompleted: false,
        userEmail: { $exists: true, $ne: null },
        reminderSent: false
    });

    console.log(tareas);

    tareas.forEach(tarea => {
        // Enviar el recordatorio
        enviarRecordatorioTarea(tarea).then(() => {
            // Actualizar la tarea para marcar que el recordatorio ha sido enviado
            tarea.reminderSent = true;
            tarea.save();
        }).catch(error => {
            console.error("Error enviando recordatorio de tarea:", error);
        });
    });
});

app.put('/tasks/:taskId', async (req, res) => {
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
});