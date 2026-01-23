const jwt = require("jsonwebtoken");


// Middleware para verificar el token JWT, va separado del controller para mejor organización
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  // Verificamos que el header Authorization esté presente
  if (!bearerHeader) {
    return res.status(403).json({
      success: false,
      error: "No token provided",
    });
  }

  // Extraemos el token del header
  const token = bearerHeader.split(" ")[1];

  // Verificamos el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Diferenciar expiración de token inválido 
      const message =
        err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
      return res.status(403).json({
        success: false,
        error: message,
      });
    }

    // Inyectamos el usuario en la request para las siguientes rutas
    req.user = decoded;
    next(); // Pasa el control al siguiente middleware/controlador
  });
};

module.exports = verifyToken;
