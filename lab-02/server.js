
const express = require("express");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "database", "books.db");

let db = null;

// Initialize database and start server
const initializeDBAndServer = async () => {
  try {
    db = await sqlite.open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Database connected successfully");

    const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET all books
app.get("/books/", async (request, response) => {
  const books = await db.all("SELECT * FROM books");
  response.send(books);
});

// GET a single book
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const book = await db.get(
    "SELECT * FROM books WHERE id = ?",
    [bookId]
  );

  if (book === undefined) {
    response.status(404).send("Book not found");
  } else {
    response.send(book);
  }
});

// POST a new book
app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  if (!title || !author || price === undefined || pages === undefined) {
    return response.status(400).send("All fields are required");
  }

  const query = `
    INSERT INTO books (title, author, price, pages)
    VALUES (?, ?, ?, ?)
  `;

  await db.run(query, [title, author, price, pages]);

  response.status(201).send("Book added successfully");
});

// PUT update a book
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  const query = `
    UPDATE books
    SET title = ?, author = ?, price = ?, pages = ?
    WHERE id = ?
  `;

  const result = await db.run(query, [
    title,
    author,
    price,
    pages,
    bookId,
  ]);

  if (result.changes === 0) {
    response.status(404).send("Book not found");
  } else {
    response.send("Book updated successfully");
  }
});

// DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const result = await db.run(
    "DELETE FROM books WHERE id = ?",
    [bookId]
  );

  if (result.changes === 0) {
    response.status(404).send("Book not found");
  } else {
    response.send("Book deleted successfully");
  }
});
