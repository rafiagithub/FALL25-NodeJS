# Simple Web Application with Node.js, Express, and MongoDB

This guide will help you create a simple web application from scratch using Node.js, Express, and MongoDB. By the end of this tutorial, you will have a basic understanding of how to set up a web server, connect to a MongoDB database, and perform CRUD operations.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [MongoDB](https://www.mongodb.com/try/download/community) installed on your machine
- Basic understanding of JavaScript and web development

## Step 1: Set Up Your Development Environment

1. **Install Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/).
2. **Install MongoDB**: Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community).

## Step 2: Initialize Your Project

1. Create a new directory for your project and navigate into it:
   ```bash
   mkdir my-web-app
   cd my-web-app
   ```
2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

## Step 3: Install Dependencies

Install the necessary packages:
```bash
npm install express mongoose body-parser
```

## Step 4: Create the Project Structure

Create the following directory structure:
```
my-web-app/
├── models/
│   └── user.js
├── routes/
│   └── users.js
├── app.js
└── package.json
```

## Step 5: Create the Express Server

Create a basic Express server in `app.js`:
```javascript name=app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mywebapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const users = require('./routes/users');
app.use('/users', users);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

## Step 6: Create a User Model

Create a user model in `models/user.js`:
```javascript name=models/user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);
```

## Step 7: Create Routes for User Operations

Create routes for user operations in `routes/users.js`:
```javascript name=routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Create a new user
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

## Step 8: Run Your Application

Start your application by running:
```bash
node app.js
```

Your application should now be running on `http://localhost:3000`.

## Step 9: Test Your Application

You can use tools like Postman or cURL to test your API endpoints.

## Conclusion

You've now created a simple web application using Node.js, Express, and MongoDB. This application includes basic CRUD operations for user data. From here, you can expand and add more features as you learn more about web development.
