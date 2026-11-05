# 📚 Servidor Backend para Librería en Línea

Aplicación del lado del servidor construida con **Node.js** y **Express** para la gestión de catálogo de libros, autenticación de usuarios, gestión concurrente de reseñas y soporte de operaciones asíncronas mediante **Promesas** y **Async/Await**.

---

## 🛠️ Tecnologías y Dependencias

- **Entorno de ejecución:** Node.js (v24+)
- **Framework web:** Express.js (`v4.21.2`)
- **Autenticación y Seguridad:**
  - `jsonwebtoken` (`^9.0.2`): Generación y verificación de tokens de acceso (JWT).
  - `express-session` (`^1.18.1`): Manejo de sesiones de usuario del lado del cliente/servidor.
- **Cliente HTTP / Pruebas:** `axios` (`^1.7.9`) para solicitudes y pruebas concurrentes.

---

## 📁 Estructura del Repositorio

```text
├── books.json              # Catálogo de datos en formato JSON
├── index.js                # Punto de entrada del servidor Express y middleware de autenticación
├── package.json            # Metadatos del proyecto y dependencias
├── test_client.js          # Suite de pruebas automatizadas y validación de concurrencia
├── router/
│   ├── booksdb.js          # Persistencia y carga de libros desde books.json
│   ├── general.js          # Rutas públicas y endpoints asíncronos (búsquedas, registro)
│   └── auth_users.js       # Rutas protegidas (login, agregar/actualizar/eliminar reseñas)
└── [Evidencias de evaluación]
    ├── getallbooks         # Evidencia cURL: Obtener todos los libros
    ├── getbooksbyISBN      # Evidencia cURL: Búsqueda por ISBN
    ├── getbooksbyauthor    # Evidencia cURL: Búsqueda por Autor
    ├── getbooksbytitle     # Evidencia cURL: Búsqueda por Título
    ├── getbookreview       # Evidencia cURL: Consulta de reseñas de un libro
    ├── register            # Evidencia cURL: Registro exitoso de usuario
    ├── login               # Evidencia cURL: Inicio de sesión con JWT
    ├── reviewadded         # Evidencia cURL: Reseña agregada/modificada
    ├── deletereview        # Evidencia cURL: Reseña eliminada por su autor
    └── githubrepo          # Evidencia de metadatos del repositorio de GitHub
```

---

## 🚀 Endpoints de la API

### 1. Rutas Públicas (`router/general.js`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Lista completa de todos los libros disponibles |
| `GET` | `/isbn/:isbn` | Detalles de un libro por su código ISBN |
| `GET` | `/author/:author` | Búsqueda de libros por nombre de autor |
| `GET` | `/title/:title` | Búsqueda de libros por título |
| `GET` | `/review/:isbn` | Obtiene las reseñas asociadas a un libro |
| `POST` | `/register` | Registra un nuevo usuario (`username`, `password`) |

### 2. Endpoints Asíncronos con Promesas / Async-Await (`router/general.js`)

| Método | Endpoint | Implementación |
| :--- | :--- | :--- |
| `GET` | `/async/books` | Recuperación asíncrona mediante `async/await` |
| `GET` | `/async/isbn/:isbn` | Búsqueda por ISBN utilizando cadenas de `Promise.then().catch()` |
| `GET` | `/async/author/:author` | Búsqueda por Autor empleando `async/await` |
| `GET` | `/async/title/:title` | Búsqueda por Título utilizando `Promise` |

### 3. Rutas Autenticadas (`router/auth_users.js`)

Requieren autenticación activa en la sesión (`/customer/auth/*`) validada por JWT:

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/customer/login` | Inicia sesión del usuario y genera token JWT almacenado en sesión |
| `PUT` | `/customer/auth/review/:isbn` | Agrega o modifica una reseña para el ISBN indicado (parámetro query o body `review`) |
| `DELETE` | `/customer/auth/review/:isbn` | Elimina la reseña propia del usuario autenticado para dicho ISBN |

---

## 🔒 Mecanismo de Autenticación y Concurrencia

1. **Autenticación (JWT + Sesiones):**
   - Al iniciar sesión con éxito en `/customer/login`, se emite un JSON Web Token firmado y se vincula a `req.session.authorization`.
   - El middleware en `index.js` intercepta cada petición a `/customer/auth/*`, extrae el token y lo valida con `jwt.verify`.

2. **Acceso Concurrente:**
   - Cada reseña se almacena bajo la clave del nombre de usuario (`books[isbn].reviews[username] = review`).
   - Múltiples usuarios pueden consultar, añadir y actualizar reseñas en paralelo sin sobreescribir las opiniones de los demás.
   - Si un usuario actualiza su reseña sobre un mismo libro, se modifica su entrada existente sin duplicados.

---

## 💻 Instrucciones de Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor:**
   ```bash
   npm start
   # El servidor quedará escuchando en http://localhost:5000
   ```

3. **Ejecutar suite de pruebas automatizada:**
   ```bash
   npm test
   ```

---

## 📜 Historial de Commits del Repositorio

- **`ccf69f2`** - `Se realizó el proyecto`
  - Implementación inicial de la arquitectura backend, base de datos de libros, rutas públicas, rutas autenticadas con JWT/sesiones y script de pruebas (`test_client.js`).
- **`daee53f`** - `docs: agregar evidencias cURL y resultados de las pruebas`
  - Incorporación de los archivos de evidencias generados con cURL para evaluación (`getallbooks`, `getbooksbyISBN`, `getbooksbyauthor`, `getbooksbytitle`, `getbookreview`, `register`, `login`, `reviewadded`, `deletereview`, `githubrepo`).
- **`README.md`** (Commit actual):
  - Documentación técnica completa de arquitectura, endpoints, concurrencia, seguridad e instrucciones de ejecución.
