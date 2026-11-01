# Lab 2: SQLite Database and CRUD Routes

## Student Details
- **Name:** Sneha Kasula
- **Registration Number:** N25H03A0519
- **Lab:** Backend Development Fundamentals – Lab 2

## Project Description
This project demonstrates how to create and manage a SQLite database using Node.js and Express.js. It implements CRUD operations to add, view, update, and delete book records.

## Technologies Used
- Node.js
- Express.js
- SQLite
- SQLite3
- Postman

## Database Details
Database Name: `books.db`

Table Name: `books`

Fields:
- id
- title
- author
- price
- pages

The database contains 10 initial book records.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Get all books |
| GET | `/books/:bookId/` | Get a book by ID |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update a book |
| DELETE | `/books/:bookId/` | Delete a book |

## How to Run the Project

1. Open the project folder in VS Code.
2. Install dependencies:

`npm install`

3. Start the server:

`npm run dev`

4. Open `http://localhost:3000/books/` in your browser or test the API using Postman.

## Screenshots
Postman screenshots and database screenshots are available in the SS folder.

## Deployment
The project was tested locally using Node.js, Express.js, and SQLite. It has not been deployed online.