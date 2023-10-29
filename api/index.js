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