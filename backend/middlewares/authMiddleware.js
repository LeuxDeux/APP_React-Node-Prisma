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

  // Chequeo si el token tiene el formato de Bearer
  if (!bearerHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Invalid token format. Use 'Bearer <token>'" });
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

// Este middleware ASUME que req.user ya existe (es decir, verifyToken corrió antes)
const verifyAdmin = (req, res, next) => {
  // 1. Verificación defensiva: ¿Pasó verifyToken antes?
  if (!req.user) {
    return res.status(500).json({
      success: false,
      error: "Server Error: verifyAdmin called without verifyToken",
    });
  }

  // 2. Verificación del Rol
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied: Admins only",
    });
  }

  next();
};

module.exports = { verifyToken, verifyAdmin }; // Exportar ambos
