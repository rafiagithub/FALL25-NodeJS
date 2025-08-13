# Creating an Admin Panel for CRUD Operations

This guide will help you create an admin panel where an admin can perform CRUD operations on user data. We will add a new route for the admin panel and create the front-end pages for the admin to view, add, update, and delete users. We will also add authentication for the admin panel.

## Step 1: Set Up the Admin Panel Front-End

Create the following files inside the `public` directory:

```
my-web-app/
├── models/
│   └── user.js
├── routes/
│   └── users.js
├── public/
│   ├── admin/
│   │   ├── index.html
│   │   ├── add-user.html
│   │   ├── edit-user.html
│   │   └── script.js
│   ├── index.html
│   ├── style.css
│   └── script.js
├── middleware/
│   └── auth.js
├── app.js
└── package.json
```

### public/admin/index.html

```html name=public/admin/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="admin-container">
        <h2>Admin Panel</h2>
        <a href="add-user.html">Add User</a>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="userTableBody">
                <!-- User rows will be inserted here -->
            </tbody>
        </table>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### public/admin/add-user.html

```html name=public/admin/add-user.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add User</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="admin-container">
        <h2>Add User</h2>
        <form id="addUserForm">
            <input type="text" id="name" placeholder="Name" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Add User</button>
        </form>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### public/admin/edit-user.html

```html name=public/admin/edit-user.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit User</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="admin-container">
        <h2>Edit User</h2>
        <form id="editUserForm">
            <input type="hidden" id="userId">
            <input type="text" id="name" placeholder="Name" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password">
            <button type="submit">Update User</button>
        </form>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### public/admin/script.js

```javascript name=public/admin/script.js
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('userTableBody')) {
        await loadUsers();
    }

    if (document.getElementById('addUserForm')) {
        document.getElementById('addUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('editUserForm')) {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        const user = await fetch(`/users/${userId}`).then(res => res.json());

        document.getElementById('userId').value = user._id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;

        document.getElementById('editUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('userId').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            await fetch(`/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            window.location.href = 'index.html';
        });
    }
});

async function loadUsers() {
    const users = await fetch('/users').then(res => res.json());
    const userTableBody = document.getElementById('userTableBody');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <a href="edit-user.html?id=${user._id}">Edit</a>
                <button onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        await fetch(`/users/${id}`, {
            method: 'DELETE'
        });
        window.location.reload();
    }
}
```

## Step 2: Add Authentication Middleware

Let's add a simple middleware to protect the admin routes.

### middleware/auth.js

```javascript name=middleware/auth.js
module.exports = (req, res, next) => {
    const auth = { login: 'admin', password: 'admin' }; // Change this to a secure method

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
};
```

## Step 3: Update the Express App

Modify `app.js` to use the authentication middleware for admin routes.

### app.js

```javascript name=app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
const auth = require('./middleware/auth');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mywebapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const users = require('./routes/users');
app.use('/users', users);

// Admin routes
app.use('/admin', auth, express.static(path.join(__dirname, 'public/admin')));

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

## Step 4: Test the Admin Panel

1. Start your application by running:
   ```bash
   node app.js
   ```

2. Open your browser and navigate to `http://localhost:3000/admin`. You will be prompted to enter a username and password. Use `admin` for both username and password (you should change this to a secure method in a real application).

3. You should see the admin panel where you can view, add, update, and delete users.

## Conclusion

You've now created an admin panel for your web application using Node.js, Express, and MongoDB. This includes serving static files, handling user authentication, and performing CRUD operations. 
