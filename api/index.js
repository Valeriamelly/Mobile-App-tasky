const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const saltRounds = 10; // Puedes aumentar el número de rondas para un hash más seguro
const twilio = require('twilio');
const accountSid = 'AC9f5c5a71cf0e0a171ffb4e4329341b4c';
const authToken = '396c661ab35f9bd94fd180037d5b4697';


const client = new twilio(accountSid, authToken);



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

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear un nuevo usuario con la contraseña hasheada
        const newUser = new User({ name, email, password: hashedPassword });

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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Contraseña inválida" });
        }
        /*
        // Chequear si la contraseña es correcta 
        if (user.password !== password) {
            return res.status(401).json({ message: "Contraseña inválida" });
        } */

        // Chequear si el correo está verificado
        if (!user.verified) {
            return res.status(401).json({ error: "Verifica tu correo electrónico antes de iniciar sesión" });
        }

        // Generar un token
        const token = jwt.sign({ userId: user._id }, secretKey);

        // Devolver el token y el correo electrónico en la respuesta
        res.status(200).json({ token, userEmail: user.email, userId: user._id.toString() });

    } catch (error) {
        res.status(500).json({ error: "Login Failed" });
    }
});

// Ruta para crear un nuevo proyecto
app.post('/add-project', async (req, res) => {
    try {
        const { name, description, userId } = req.body;
        const newProject = new Project({ name, description, userId });
        await newProject.save();
        res.status(201).json({ message: 'Proyecto creado exitosamente', project: newProject });
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        res.status(500).json({ message: 'Error al crear el proyecto' });
    }
});

app.get('/projects', async (req, res) => {
    try {
        const userId = req.query.userId; // Obtener el userId desde los parámetros de consulta

        if (!userId) {
            return res.status(400).json({ message: 'Falta el ID del usuario' });
        }

        const projects = await Project.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
        const newTask = new Task({ name, description, projectId, startDate, endDate });
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

        // Encuentra el proyecto asociado con la tarea
        const proyecto = await Project.findById(tarea.projectId);
        if (!proyecto) {
            console.error("Proyecto no encontrado para la tarea:", tarea._id);
            return;
        }

        // Encuentra el usuario asociado con el proyecto
        const usuario = await User.findById(proyecto.userId);
        if (!usuario || !usuario.email) {
            console.error("Usuario no encontrado o sin correo electrónico para el proyecto:", proyecto._id);
            return;
        }

        const mailOptions = {
            from: '"Tasky G2" <grupitogpt4@gmail.com>', // Nombre personalizado y dirección de correo
            to: usuario.email,
            subject: "Recordatorio de Tarea Próxima a Vencer",
            text: `Hola ${usuario.name}!\n\nQueremos recordarte que tu tarea "${tarea.name}" en el proyecto "${proyecto.name}" está programada para terminar en una hora.\n\nDescripción de la tarea: ${tarea.description}\nFecha de inicio: ${tarea.startDate.toLocaleString()}\nFecha de vencimiento: ${tarea.endDate.toLocaleString()}\n\n¡Recuerda completarla a tiempo para mantener tu productividad alta!`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Recordatorio de tarea enviado exitosamente");
        } catch (error) {
            console.error("Error enviando recordatorio de tarea:", error);
        }

        const numeroDestino = `whatsapp:+51${usuario.phoneNumber}`;
        console.log(numeroDestino);
        const numeroTwilio = 'whatsapp:+14155238886'; // Tu número de WhatsApp de Twilio

        // Personaliza el mensaje de WhatsApp
        const mensajeWhatsApp = `*Recordatorio de Tarea Próxima a Vencer*\n\nHola! Solo un recordatorio de que tu tarea *"${tarea.name}"* en el proyecto *"${proyecto.name}"* está programada para terminar en una hora.\n\nDescripción de la tarea: ${tarea.description}\nFecha de vencimiento: ${tarea.endDate.toLocaleString()}`;

        // Verificar si el usuario tiene un número de teléfono definido
        if (!usuario.phoneNumber) {
            console.error("Usuario no tiene un número de teléfono definido para recibir recordatorios.");
            return;
        }

        client.messages
            .create({
                body: mensajeWhatsApp,
                from: numeroTwilio,
                to: numeroDestino
            })
            .then(message => console.log(message.sid))
            .catch(error => console.error('Error al enviar mensaje:', error));
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
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber // Añade esta línea
        });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ message: 'Error al obtener el perfil del usuario.' });
    }
});

// Ruta para actualizar el perfil del usuario
app.put('/profile', authenticateUser, async (req, res) => {
    try {
        const { name, password, phoneNumber } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber; // Actualiza el número de teléfono

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ message: 'Perfil actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
});

app.put('/update-project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { name, description },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        res.status(200).json({ message: 'Proyecto actualizado con éxito', project: updatedProject });
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        res.status(500).json({ message: 'Error al actualizar el proyecto' });
    }
});

// Ruta para actualizar una tarea
app.put('/update-task/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, description, startDate, endDate, isCompleted } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { name, description, startDate, endDate, isCompleted },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json({ message: 'Tarea actualizada con éxito', task: updatedTask });
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
});


// Ruta para eliminar un proyecto
app.delete('/projects/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        // Opcional: Verificar si el proyecto existe antes de intentar eliminarlo
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        // Eliminar el proyecto
        await Project.findByIdAndDelete(projectId);

        res.json({ message: 'Proyecto eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ message: 'Error al eliminar el proyecto.' });
    }
});

// Ruta para eliminar una tarea específica
app.delete('/tasks/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;

        // Opcional: Verificar si la tarea existe antes de intentar eliminarla
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        // Eliminar la tarea
        await Task.findByIdAndDelete(taskId);

        res.json({ message: 'Tarea eliminada con éxito.' });
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea.' });
    }
});

// Ruta para solicitar restablecimiento de contraseña y enviar código de verificación
app.post('/request-reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            // Generar código de verificación de 4 valores alfanuméricos
            const verificationToken = Math.random().toString(36).slice(2, 6).toUpperCase();

            // Guardar el código en el campo verificationToken y la fecha de expiración
            user.verificationToken = verificationToken;
            user.resetPasswordExpires = Date.now() + 3600000; // El código expira en 1 hora


            await user.save();

            // Envía el código de verificación al correo del usuario
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "grupitogpt4@gmail.com",
                    pass: "khog vovx kkey blhf",
                },
            });

            const mailOptions = {
                from: '"Tasky G2" <grupitogpt4@gmail.com>',
                to: user.email,
                subject: 'Restablecimiento de contraseña',
                text: `Se ha solicitado un restablecimiento de contraseña para tu cuenta.\n\n
                        Tu código de verificación es: ${verificationToken}\n\n
                        Por favor, nota que este código será válido solo por 60 minutos.`,
            };
            
            await transporter.sendMail(mailOptions);
            
            res.json({ message: 'Código de verificación enviado correctamente.' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error('Error al solicitar código de verificación:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
});
// Ruta para verificar el código de verificación y restablecer la contraseña
app.post('/reset-password', async (req, res) => {
    try {
        const { verificationToken, newPassword } = req.body;
        const user = await User.findOne({
            verificationToken: verificationToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Código de verificación inválido o expirado.' });
        }

        user.password = await bcrypt.hash(newPassword, saltRounds);
        user.verificationToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
});


// Nueva ruta para obtener tareas por ID de usuario
app.get('/tasks/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      // Primero, encontrar todos los proyectos del usuario
      const projects = await Project.find({ userId: userId });
      const projectIds = projects.map(project => project._id);
  
      // Luego, encontrar todas las tareas asociadas a esos proyectos
      const tasks = await Task.find({ projectId: { $in: projectIds } });
      res.status(200).json({ tasks: tasks });
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      res.status(500).json({ message: 'Error al obtener las tareas' });
    }
  });
  
  