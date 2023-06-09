// contient les fonctions de contrôle pour gérer les opérations sur les livres
//logique de contrôle est placée dans le contrôleur, et la logique de manipulation de la data est placée dans le modèle
//utilise le modèle Book et le module Joi pour valider les données entrantes
const Book = require("../model/book");
const Joi = require("@hapi/joi");

//READ ALL
const getBooks = async (req, res, next) => {
  try {
    const { title, author, sort, page = 1, limit = 10 } = req.query;
    const books = await Book.getBooks({ title, author, sort, page, limit });
    res.json(books);
  } catch (err) {
    next(err);
  }
};

// READ ONE
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.getBookById(req.params.id);
    res.json(book);
  } catch (err) {
    next(err);
  }
};

// CREATE
const addBook = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    nationality: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    console.log("Nope marche pas");
    return;
  }

  try {
    const book = await Book.addBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

// UPDATE
const updateBook = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    nationality: Joi.string().optional(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  try {
    const updatedBook = await Book.updateBook(req.params.id, req.body);
    res.json(updatedBook);
  } catch (err) {
    next(err);
  }
};

// DELETE
const deleteBook = async (req, res, next) => {
  try {
    const deletedBook = await Book.deleteBook(req.params.id);
    res.json(deletedBook);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};