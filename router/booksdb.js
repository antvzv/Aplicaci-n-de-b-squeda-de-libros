const fs = require('fs');
const path = require('path');

let books = {
  1: { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {} },
  2: { "author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {} },
  3: { "author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": {} },
  4: { "author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": {} },
  5: { "author": "Unknown", "title": "The Book Of Job", "reviews": {} },
  6: { "author": "Unknown", "title": "One Thousand and One Nights", "reviews": {} },
  7: { "author": "Unknown", "title": "Njál's Saga", "reviews": {} },
  8: { "author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {} },
  9: { "author": "Honoré de Balzac", "title": "Le Père Goriot", "reviews": {} },
  10: { "author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, story uncollected", "reviews": {} }
};

const jsonPath = path.join(__dirname, '..', 'books.json');

// Cargar desde books.json si existe
if (fs.existsSync(jsonPath)) {
  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const parsedData = JSON.parse(rawData);
    if (parsedData && Object.keys(parsedData).length > 0) {
      books = parsedData;
    }
  } catch (err) {
    console.error("Error al leer books.json:", err);
  }
}

module.exports = books;

