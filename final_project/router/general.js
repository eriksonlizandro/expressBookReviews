const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// ============================================
// SYNCHRONOUS ROUTES (Tasks 1-5)
// ============================================

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  
  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }
  
  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  
  for (let key in books) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }
  
  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// ============================================
// TASKS 10-13: Using Async-Await with Axios
// ============================================

// Task 10: Get all books - using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Task 11: Get book by ISBN - using async/await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({message: "Book not found"});
    } else {
      res.status(500).json({message: "Error fetching book", error: error.message});
    }
  }
});

// Task 12: Get books by Author - using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({message: "No books found by this author"});
    } else {
      res.status(500).json({message: "Error fetching books", error: error.message});
    }
  }
});

// Task 13: Get books by Title - using async/await with Axios  
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({message: "No books found with this title"});
    } else {
      res.status(500).json({message: "Error fetching books", error: error.message});
    }
  }
});