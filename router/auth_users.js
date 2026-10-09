const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length === 0;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
};

// Iniciar sesión como usuario registrado
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error al iniciar sesión. Se requieren usuario y contraseña." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Credenciales de inicio de sesión no válidas" });
  }
});

// Agregar o modificar una reseña de libro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review || req.body.review;
  let username = req.session.authorization ? req.session.authorization['username'] : (req.user ? (req.user.data || req.user.username) : null);

  if (!username) {
    return res.status(403).json({ message: "Usuario no autenticado." });
  }

  if (!review) {
    return res.status(400).json({ message: "Se requiere el texto de la reseña." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Libro no encontrado." });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
});

// Eliminar reseña de libro agregada por el usuario
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization ? req.session.authorization['username'] : (req.user ? (req.user.data || req.user.username) : null);

  if (!username) {
    return res.status(403).json({ message: "Usuario no autenticado." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Libro no encontrado." });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).send(`Review for the ISBN ${isbn} posted by the user ${username} deleted.`);
  } else {
    return res.status(404).json({ message: `No se encontró una reseña del usuario ${username} para el libro con ISBN ${isbn}.` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

