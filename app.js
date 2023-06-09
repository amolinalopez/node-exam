//point d'entrée de l'application. Il configure l'application Express,
// définit les routes et les middlewares, et lance le serveur

require("dotenv").config();
const express = require("express");
const app = express();
const booksController = require("./controllers/booksController");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get("/books", booksController.getBooks);
app.get("/books/:id", booksController.getBookById);
app.post("/books", booksController.addBook);
app.put("/books/:id", booksController.updateBook);
app.delete("/books/:id", authMiddleware, booksController.deleteBook);

// error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message });
});

app.use((req, res) => {
  res
    .status(404)
    .json({ error: "Not found ------- va sur http://localhost:3000/books/" });
});

app.listen(3000, () => console.log(`Listening on port 3000`));
