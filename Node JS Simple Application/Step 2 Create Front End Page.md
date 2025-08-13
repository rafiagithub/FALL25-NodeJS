# Creating a Front-End Login Page

This guide will help you create a front-end login page for your web application using HTML, CSS, and JavaScript. We will also modify the Express backend to handle user authentication.

## Step 1: Set Up the Front-End

Create a directory called `public` to store your front-end files. Inside `public`, create three files: `index.html`, `style.css`, and `script.js`.

```
my-web-app/
├── models/
│   └── user.js
├── routes/
│   └── users.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── app.js
└── package.json
```

### index.html

```html name=public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <h2>Login</h2>
        <form id="loginForm">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <p id="errorMessage"></p>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### style.css

```css name=public/style.css
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}

.login-container {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
    margin-bottom: 20px;
}

.login-container input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.login-container button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
}

#errorMessage {
    color: red;
    margin-top: 10px;
}
```

### script.js

```javascript name=public/script.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
        alert('Login successful!');
        // Redirect to another page or perform any other actions
    } else {
        document.getElementById('errorMessage').textContent = data.error;
    }
});
```

## Step 2: Serve Static Files and Handle Login in the Backend

Modify `app.js` to serve static files and handle login requests.

### app.js

```javascript name=app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');

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

## Step 3: Test the Login Page

1. Start your application by running:
   ```bash
   node app.js
   ```

2. Open your browser and navigate to `http://localhost:3000`. You should see the login page.

3. Enter the email and password of an existing user in your database and click "Login". If the credentials are correct, you should see a success message.

## Conclusion

You've now created a front-end login page for your web application using Node.js, Express, and MongoDB. This includes serving static files and handling user authentication. You can expand and customize this further based on your needs.