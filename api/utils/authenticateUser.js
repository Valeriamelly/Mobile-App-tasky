//DEPRECAO

const jwt = require('jsonwebtoken');
const authControl  = require('../controllers/authenticationController')

const secretKey = authControl.secretKey;

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Autenticación fallida" });
  }
};

module.exports = authenticateUser;
