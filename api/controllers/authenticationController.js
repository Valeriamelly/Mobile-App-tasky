const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');  
const User = require('../models/user');
const { secretKey } = require('../utils/authenticateUser')


const saltRounds = 10;

//Funcion para enviar Email al usuario
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
        text: `Por favor click al siguiente enlace para verificar tu email: http://localhost:8000/users/verify/${verificationToken}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verificacion de email enviada exitosamente");
    } catch (error) {
        console.error("Error enviando verificación de email:", error);
    }
};

exports.register = async (req, res) => {
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
        console.error('Error registrando usuario:', error);
        res.status(500).json({ message: 'Registro fallido' });
    }
};

exports.verifyEmail = async (req, res) => {
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
        res.status(500).json({ message: 'Verificación del email fallida' });
    }
};

exports.login = async (req, res) => {
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
        res.status(200).json({ token, userEmail: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Login Failed' });
    }
};

