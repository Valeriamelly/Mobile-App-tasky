const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,  // Para la verificación del correo electrónico
  resetPasswordToken: String, // Para el restablecimiento de la contraseña
  resetPasswordExpires: Date, // Fecha de expiración del token de restablecimiento
});

const User = mongoose.model('User',userSchema);

module.exports = User;