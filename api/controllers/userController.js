const bcrypt = require('bcrypt');
const User = require('../models/user');

const saltRounds = 10;

exports.getUserProfile = async (req, res) => {
  try {
    // Obtener el perfil del usuario
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
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    // Buscar al usuario por ID
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar los campos necesarios
    if (name) user.name = name;

    // Asegúrate de que la contraseña no sea una cadena vacía antes de hashearla
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }

    // Guardar el usuario actualizado en la base de datos
    await user.save();

    // Enviar una respuesta exitosa
    res.json({ message: 'Perfil actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil.' });
  }
};

