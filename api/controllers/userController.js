const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require('../models/user');
const jwt = require("jsonwebtoken");



//Funcion para enviar Email al usuario
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

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
}

const secretKey = generateSecretKey();

module.exports = {

  //Registrar usuario en la app
  async register(req, res) {
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
  },

  //Iniciar sesión del usuario
  async login(req, res) {
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
        return res.status(401).json({ error: "Verifica tu correo electrónico antes de iniciar sesión" });
      }

      //generate a token
      const token = jwt.sign({ userId: user._id }, secretKey);

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Login Failed" });
    }

  },

  async authentication(req, res) {
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
  }

}