# RESTful API Example and Instructions

## What is a RESTful API?

A RESTful API (Representational State Transfer API) is an application programming interface that adheres to REST architectural principles. It allows interaction with web services in a stateless and standardized way.

### Key Characteristics of RESTful APIs:
1. **Stateless**: Each request contains all the information needed to process it.
2. **Client-Server Architecture**: Separates client and server concerns.
3. **Cacheable**: Responses can be cached to improve performance.
4. **Uniform Interface**: Standardized interaction with resources.
5. **Layered System**: Supports intermediaries like load balancers and caches.
6. **Code on Demand (optional)**: Servers can send executable code to clients.

---

## Example RESTful API for Managing Books

This example demonstrates a simple RESTful API for managing a library of books. The API supports CRUD operations: Create, Read, Update, and Delete.

### Endpoints

1. **GET /books**
   - Retrieve a list of all books.
   - **Example Request**:  
     ```http
     GET http://localhost:3000/books
     ```
   - **Example Response**:  
     ```json
     [
       {
         "id": 1,
         "title": "The Great Gatsby",
         "author": "F. Scott Fitzgerald",
         "published_year": 1925
       },
       {
         "id": 2,
         "title": "To Kill a Mockingbird",
         "author": "Harper Lee",
         "published_year": 1960
       }
     ]
     ```

2. **GET /books/{id}**
   - Retrieve details of a specific book by its ID.
   - **Example Request**:  
     ```http
     GET http://localhost:3000/books/1
     ```
   - **Example Response**:  
     ```json
     {
       "id": 1,
       "title": "The Great Gatsby",
       "author": "F. Scott Fitzgerald",
       "published_year": 1925
     }
     ```

3. **POST /books**
   - Create a new book.
   - **Example Request**:  
     ```http
     POST http://localhost:3000/books
     Content-Type: application/json

     {
       "title": "1984",
       "author": "George Orwell",
       "published_year": 1949
     }
     ```
   - **Example Response**:  
     ```json
     {
       "id": 3,
       "title": "1984",
       "author": "George Orwell",
       "published_year": 1949
     }
     ```

4. **PUT /books/{id}**
   - Update details of an existing book by its ID.
   - **Example Request**:  
     ```http
     PUT http://localhost:3000/books/1
     Content-Type: application/json

     {
       "title": "The Great Gatsby",
       "author": "F. Scott Fitzgerald",
       "published_year": 1926
     }
     ```
   - **Example Response**:  
     ```json
     {
       "id": 1,
       "title": "The Great Gatsby",
       "author": "F. Scott Fitzgerald",
       "published_year": 1926
     }
     ```

5. **DELETE /books/{id}**
   - Delete a book by its ID.
   - **Example Request**:  
     ```http
     DELETE http://localhost:3000/books/1
     ```
   - **Example Response**:  
     ```json
     {
       "message": "Book deleted successfully"
     }
     ```

---

## Example Code for RESTful API

The following code implements the above API using Node.js and Express:

```javascript name=app.js
const express = require('express');
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', published_year: 1925 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', published_year: 1960 }
];

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

app.post('/books', (req, res) => {
  const book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    published_year: req.body.published_year
  };
  books.push(book);
  res.json(book);
});

app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');

  book.title = req.body.title;
  book.author = req.body.author;
  book.published_year = req.body.published_year;
  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).send('Book not found');

  books.splice(bookIndex, 1);
  res.json({ message: 'Book deleted successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## Setting Up the Code in Visual Studio Code

1. **Install Node.js**: Download and install Node.js and npm from [nodejs.org](https://nodejs.org/).
2. **Create a New Project Folder**: Open Visual Studio Code and create a new folder for your project.
3. **Initialize the Project**:
   - Open the terminal in Visual Studio Code.
   - Run `npm init -y` to create a `package.json` file.
4. **Install Express**:
   - Run `npm install express` to install Express.
5. **Add the Code**:
   - Create a file named `app.js` and paste the above code into it.
6. **Run the Server**:
   - Run `node app.js` in the terminal.
   - The server will start on `http://localhost:3000`.
7. **Test the API**:
   - Use Postman or cURL to test the endpoints.

Congratulations! You've set up and run your first RESTful API.
