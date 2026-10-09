const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configuración de la sesión para las rutas /customer
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Middleware de autenticación para rutas protegidas en /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    let token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "Usuario no autenticado / Token inválido" });
      }
    });
  } else {
    return res.status(403).json({ message: "El usuario no ha iniciado sesión" });
  }
});

const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Servidor de la librería en línea ejecutándose en el puerto ${PORT}`));

