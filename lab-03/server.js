
const express = require("express");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.json({
    message: "Welcome to the Lab 3 Books REST API",
    project: "Book Management System",
    version: "1.0.0",
    author: "Sneha Kasula",
    description: "A REST API built using Node.js, Express and SQLite to manage book records.",
    endpoints: {
      getAllBooks: "GET /books",
      getBookById: "GET /books/:bookId",
      addBook: "POST /books",
      updateBook: "PUT /books/:bookId",
      deleteBook: "DELETE /books/:bookId"
    }
  });
});

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

// GET all books with search, sorting, pagination and price filter
app.get("/books", async (request, response) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price,
    } = request.query;

    const allowedColumns = ["id", "title", "author", "price", "pages"];
    const sortColumn = allowedColumns.includes(order_by) ? order_by : "id";
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const conditions = [];
    const values = [];

    if (search_q) {
      conditions.push("title LIKE ?");
      values.push(`%${search_q}%`);
    }

    if (min_price !== undefined) {
      conditions.push("price >= ?");
      values.push(Number(min_price));
    }

    if (max_price !== undefined) {
      conditions.push("price <= ?");
      values.push(Number(max_price));
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const safeOffset = Math.max(0, Number(offset) || 0);

    const query = `
      SELECT * FROM books
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    values.push(safeLimit, safeOffset);

    const books = await db.all(query, values);
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({ message: "Unable to fetch books" });
  }
});
// GET a single book
app.get("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    const book = await db.get(
      "SELECT * FROM books WHERE id = ?",
      [bookId]
    );

    if (!book) {
      return response.status(404).json({
        message: "Book not found",
      });
    }

    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({
      message: "Unable to fetch book",
    });
  }
});

// POST a new book
app.post("/books", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    if (
      !title ||
      !author ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(pages) ||
      pages <= 0
    ) {
      return response.status(400).json({
        message: "Title, author, valid numeric price and positive pages are required",
      });
    }

    const query = `
      INSERT INTO books (title, author, price, pages)
      VALUES (?, ?, ?, ?)
    `;

    await db.run(query, [title, author, price, pages]);

    response.status(201).json({
      message: "Book added successfully",
    });
  } catch (error) {
    response.status(500).json({
      message: "Unable to add book",
    });
  }
});

// PUT update a book
app.put("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    if (
      !title ||
      !author ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(pages) ||
      pages <= 0
    ) {
      return response.status(400).json({
        message: "Please provide valid title, author, price and pages",
      });
    }

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
      return response.status(404).json({
        message: "Book not found",
      });
    }

    response.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    response.status(500).json({
      message: "Unable to update book",
    });
  }
});

// DELETE a book
app.delete("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    const result = await db.run(
      "DELETE FROM books WHERE id = ?",
      [bookId]
    );

    if (result.changes === 0) {
      return response.status(404).json({
        message: "Book not found",
      });
    }

    response.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    response.status(500).json({
      message: "Unable to delete book",
    });
  }
});
