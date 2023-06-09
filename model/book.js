//modèle de données pour un livre
// logique de manip de la data et opérations CRUD
// utilise le module fs pour lire et écrire des données depuis le fichier JSON
const fs = require("fs").promises;
const path = require("path");
const Joi = require("@hapi/joi");
const filePath = path.resolve("./data/library.json");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  nationality: Joi.string().required(),
});

async function readFromJsonFile() {
  const data = await fs.readFile(filePath);
  return JSON.parse(data);
}

async function writeToJsonFile(data) {
  return fs.writeFile(filePath, JSON.stringify(data, null, 12));
}

exports.getBooks = async ({ title, author, sort, page, limit }) => {
  const data = await readFromJsonFile();
  let books = data;

  // Filtering
  if (title) {
    books = books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (author) {
    books = books.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  // Sorting
  if (sort === "title") {
    books.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Pagimnation
  const start = (page - 1) * limit;
  books = books.slice(start, start + limit);

  return books;
};

// exports.getBookById = async (id) => {
//   const data = await readFromJsonFile();
//   return data.find((book) => book.id === id);
// };
exports.getBookById = async (id) => {
  const data = await readFromJsonFile();
  return data.find((book) => book.id === Number(id));
};

exports.addBook = async (book) => {
  await bookSchema.validateAsync(book);

  const data = await readFromJsonFile();
  const id = Math.max(...data.map((book) => book.id), 0) + 1;

  const newBook = { id, ...book };
  data.push(newBook);

  await writeToJsonFile(data);

  return newBook;
};

exports.updateBook = async (id, updates) => {
  await bookSchema.validateAsync(updates);

  const data = await readFromJsonFile();
  const bookIndex = data.findIndex((book) => book.id === Number(id));

  if (bookIndex === -1) throw new Error("Book not found");

  data[bookIndex] = { ...data[bookIndex], ...updates };

  await writeToJsonFile(data);

  return data[bookIndex];
};

exports.deleteBook = async (id) => {
  const data = await readFromJsonFile();
  const bookIndex = data.findIndex((book) => book.id === Number(id));

  if (bookIndex === -1) throw new Error("Book not found");

  const deletedBook = data.splice(bookIndex, 1);

  await writeToJsonFile(data);

  return deletedBook;
};
