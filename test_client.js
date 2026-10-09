const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Funciones cliente usando Promesas y Async-Await (Tareas 10, 11, 12 y 13 con Axios)

// Tarea 10: Obtener la lista de todos los libros usando Async-Await/Axios
async function getAllBooksAsync() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log("✅ [Tarea 10 - Client Async] Lista de todos los libros recuperada con éxito.");
    return response.data;
  } catch (error) {
    console.error("❌ Error en getAllBooksAsync:", error.message);
  }
}

// Tarea 11: Buscar por ISBN usando Promesas/Axios
function getBookByISBNPromise(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(`✅ [Tarea 11 - Client Promise] Detalles del libro para ISBN ${isbn} recuperados con éxito.`);
      return response.data;
    })
    .catch((error) => {
      console.error(`❌ Error en getBookByISBNPromise (${isbn}):`, error.message);
    });
}

// Tarea 12: Buscar por Autor usando Async-Await/Axios
async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(`✅ [Tarea 12 - Client Async] Libros del autor '${author}' recuperados con éxito.`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error en getBooksByAuthorAsync (${author}):`, error.message);
  }
}

// Tarea 13: Buscar por Título usando Promesas/Axios
function getBooksByTitlePromise(title) {
  return axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then((response) => {
      console.log(`✅ [Tarea 13 - Client Promise] Libros con el título '${title}' recuperados con éxito.`);
      return response.data;
    })
    .catch((error) => {
      console.error(`❌ Error en getBooksByTitlePromise (${title}):`, error.message);
    });
}

// Suite de Pruebas Completa
async function runTests() {
  console.log("=================================================");
  console.log("🚀 Iniciando la suite de pruebas del servidor...");
  console.log("=================================================\n");

  try {
    // 1. Obtener todos los libros
    console.log("--- 1. Recuperar lista de todos los libros ---");
    const books = await getAllBooksAsync();
    console.log("Total de libros:", Object.keys(books).length);

    // 2. Buscar por ISBN
    console.log("\n--- 2. Buscar libro por ISBN (ISBN 1) ---");
    const bookByIsbn = await getBookByISBNPromise(1);
    console.log("Libro encontrado:", bookByIsbn.title, "por", bookByIsbn.author);

    // 3. Buscar por Autor
    console.log("\n--- 3. Buscar libros por Autor ('Jane Austen') ---");
    const booksByAuthor = await getBooksByAuthorAsync("Jane Austen");
    console.log("Resultado autor:", JSON.stringify(booksByAuthor));

    // 4. Buscar por Título
    console.log("\n--- 4. Buscar libros por Título ('Fairy tales') ---");
    const booksByTitle = await getBooksByTitlePromise("Fairy tales");
    console.log("Resultado título:", JSON.stringify(booksByTitle));

    // 5. Obtener Reseñas
    console.log("\n--- 5. Obtener reseñas del libro ISBN 1 ---");
    const reviewsRes = await axios.get(`${BASE_URL}/review/1`);
    console.log("Reseñas del libro 1:", reviewsRes.data);

    // 6. Registrar Usuarios
    console.log("\n--- 6. Registrar nuevos usuarios ---");
    const regRes1 = await axios.post(`${BASE_URL}/register`, {
      username: "usuario1",
      password: "password123"
    });
    console.log("Respuesta Registro Usuario 1:", regRes1.data);

    const regRes2 = await axios.post(`${BASE_URL}/register`, {
      username: "usuario2",
      password: "password456"
    });
    console.log("Respuesta Registro Usuario 2:", regRes2.data);

    // 7. Iniciar Sesión Usuario 1
    console.log("\n--- 7. Iniciar sesión con Usuario 1 ---");
    const loginRes1 = await axios.post(`${BASE_URL}/customer/login`, {
      username: "usuario1",
      password: "password123"
    });
    console.log("Respuesta Login Usuario 1:", loginRes1.data);
    const cookieUser1 = loginRes1.headers['set-cookie'];

    // Iniciar Sesión Usuario 2
    const loginRes2 = await axios.post(`${BASE_URL}/customer/login`, {
      username: "usuario2",
      password: "password456"
    });
    const cookieUser2 = loginRes2.headers['set-cookie'];

    // 8. Agregar Reseña (Usuario 1 en Libro ISBN 1)
    console.log("\n--- 8. Agregar reseña para Usuario 1 (ISBN 1) ---");
    const addReviewRes1 = await axios.put(
      `${BASE_URL}/customer/auth/review/1?review=¡Excelente libro clásico!`,
      {},
      { headers: { Cookie: cookieUser1 } }
    );
    console.log("Respuesta Agregar Reseña Usuario 1:", addReviewRes1.data);

    // Pruebas de Acceso Concurrente: Usuario 2 agrega reseña al mismo tiempo
    console.log("\n--- 8b. Probar acceso concurrente con Usuario 2 (ISBN 1 y 2) ---");
    const [reviewTask1, reviewTask2] = await Promise.all([
      axios.put(
        `${BASE_URL}/customer/auth/review/1?review=Una obra maravillosa.`,
        {},
        { headers: { Cookie: cookieUser2 } }
      ),
      axios.put(
        `${BASE_URL}/customer/auth/review/2?review=Cuentos mágicos inmortales.`,
        {},
        { headers: { Cookie: cookieUser1 } }
      )
    ]);
    console.log("Reseña concurrente Usuario 2 en ISBN 1:", reviewTask1.data);
    console.log("Reseña concurrente Usuario 1 en ISBN 2:", reviewTask2.data);

    // Verificar Reseñas en ISBN 1 (Debe tener reseñas de ambos usuarios)
    console.log("\n--- Verificar reseñas combinadas en ISBN 1 ---");
    const checkReviews1 = await axios.get(`${BASE_URL}/review/1`);
    console.log("Reseñas actuales en ISBN 1:", checkReviews1.data);

    // 9. Actualizar Reseña (Usuario 1 modifica su reseña en ISBN 1)
    console.log("\n--- 9. Actualizar reseña existente (Usuario 1 en ISBN 1) ---");
    const updateReviewRes = await axios.put(
      `${BASE_URL}/customer/auth/review/1?review=¡Imprescindible lectura, calificación 5/5!`,
      {},
      { headers: { Cookie: cookieUser1 } }
    );
    console.log("Respuesta Actualizar Reseña:", updateReviewRes.data);

    const checkUpdatedReviews = await axios.get(`${BASE_URL}/review/1`);
    console.log("Reseñas tras actualización en ISBN 1:", checkUpdatedReviews.data);

    // 10. Eliminar Reseña (Usuario 1 elimina su reseña en ISBN 1)
    console.log("\n--- 10. Eliminar reseña (Usuario 1 en ISBN 1) ---");
    const deleteReviewRes = await axios.delete(
      `${BASE_URL}/customer/auth/review/1`,
      { headers: { Cookie: cookieUser1 } }
    );
    console.log("Respuesta Eliminar Reseña:", deleteReviewRes.data);

    const finalReviews = await axios.get(`${BASE_URL}/review/1`);
    console.log("Reseñas finales en ISBN 1 tras eliminación:", finalReviews.data);

    // 11. Probar Rutas Asíncronas del Servidor (Tareas 10-13)
    console.log("\n--- 11. Probar endpoints asíncronos en servidor ---");
    const asyncBooks = await axios.get(`${BASE_URL}/async/books`);
    console.log("GET /async/books status:", asyncBooks.status);

    const asyncIsbn = await axios.get(`${BASE_URL}/async/isbn/2`);
    console.log("GET /async/isbn/2 status:", asyncIsbn.status);

    const asyncAuthor = await axios.get(`${BASE_URL}/async/author/Dante%20Alighieri`);
    console.log("GET /async/author/Dante Alighieri status:", asyncAuthor.status);

    const asyncTitle = await axios.get(`${BASE_URL}/async/title/The%20Divine%20Comedy`);
    console.log("GET /async/title/The Divine Comedy status:", asyncTitle.status);

    console.log("\n=================================================");
    console.log("✨ TODAS LAS PRUEBAS SE COMPLETARON EXITOSAMENTE ✨");
    console.log("=================================================");

  } catch (error) {
    console.error("❌ Ocurrió un error durante la ejecución de las pruebas:", error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

// Si se ejecuta directamente, iniciar las pruebas
if (require.main === module) {
  runTests();
}

module.exports = {
  getAllBooksAsync,
  getBookByISBNPromise,
  getBooksByAuthorAsync,
  getBooksByTitlePromise,
  runTests
};

