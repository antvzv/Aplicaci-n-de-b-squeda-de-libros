const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 6: Registrar nuevo usuario
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "El usuario ya existe." });
    }
  }
  return res.status(404).json({ message: "No se pudo registrar el usuario. Debe proporcionar nombre de usuario y contraseña." });
});

// Tarea 1: Obtener la lista de todos los libros disponibles en la tienda
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Tarea 2: Obtener detalles del libro basados en ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({ message: "Libro no encontrado para el ISBN proporcionado." });
  }
});
  
// Tarea 3: Obtener detalles del libro basados en Autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  let matchingBooks = [];
  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author) {
      matchingBooks.push({
        isbn: key,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify({ booksbyauthor: matchingBooks }, null, 4));
  } else {
    return res.status(404).json({ message: "No se encontraron libros para el autor especificado." });
  }
});

// Tarea 4: Obtener detalles del libro basados en Título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  let matchingBooks = [];
  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title) {
      matchingBooks.push({
        isbn: key,
        author: books[key].author,
        reviews: books[key].reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify({ booksbytitle: matchingBooks }, null, 4));
  } else {
    return res.status(404).json({ message: "No se encontraron libros con el título especificado." });
  }
});

// Tarea 5: Obtener reseñas del libro según el ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Libro no encontrado para el ISBN especificado." });
  }
});

// =========================================================================
// Métodos Asíncronos utilizando Promesas y Async-Await (Tareas 10, 11, 12 y 13)
// =========================================================================

// Tarea 10: Obtener todos los libros usando Promesas / Async-Await
public_users.get('/async/books', async function (req, res) {
  try {
    const fetchBooks = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No se pudo recuperar la lista de libros");
      }
    });
    const bookList = await fetchBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Tarea 11: Buscar por ISBN usando Promesas
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Libro no encontrado con el ISBN especificado.");
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Tarea 12: Buscar por Autor usando Async-Await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);

    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author) {
        matchingBooks.push({
          isbn: key,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No se encontraron libros para el autor especificado.");
    }
  });

  try {
    const result = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify({ booksbyauthor: result }, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Tarea 13: Buscar por Título usando Promesas / Async-Await
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);

    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title) {
        matchingBooks.push({
          isbn: key,
          author: books[key].author,
          reviews: books[key].reviews
        });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No se encontraron libros con el título especificado.");
    }
  });

  getBooksByTitle
    .then((result) => {
      return res.status(200).send(JSON.stringify({ booksbytitle: result }, null, 4));
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

module.exports.general = public_users;

