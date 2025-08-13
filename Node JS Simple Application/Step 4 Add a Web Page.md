# Adding a Simple Front-End Page

This guide will help you add a simple, visually appealing front-end page to your web application using HTML, CSS, and a bit of JavaScript. This will include a landing page with a navigation bar, hero section, and footer.

## Step 1: Set Up the Front-End Files

Create a new directory inside the `public` directory called `landing`. Inside `landing`, create three files: `index.html`, `style.css`, and `script.js`.

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
│   ├── landing/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── index.html
│   ├── style.css
│   └── script.js
├── middleware/
│   └── auth.js
├── app.js
└── package.json
```

### public/landing/index.html

```html name=public/landing/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <h1>My Web App</h1>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/admin/index.html">Admin</a></li>
                <li><a href="/login.html">Login</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="hero">
            <h2>Welcome to My Web App</h2>
            <p>This is a simple web application using Node.js, Express, and MongoDB.</p>
            <a href="/login.html" class="btn">Get Started</a>
        </section>
    </main>
    <footer>
        <p>&copy; 2025 My Web App. All rights reserved.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
```

### public/landing/style.css

```css name=public/landing/style.css
body {
    margin: 0;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

header {
    background-color: #333;
    color: white;
    padding: 1rem 0;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: 0 auto;
}

nav h1 {
    margin: 0;
    font-size: 1.5rem;
}

nav ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}

nav ul li {
    margin-left: 1rem;
}

nav ul li a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
}

main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.hero {
    background: url('https://via.placeholder.com/1500') no-repeat center center/cover;
    color: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
}

.btn {
    background-color: #28a745;
    color: white;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: 5px;
    font-size: 1rem;
}

footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 1rem 0;
}
```

### public/landing/script.js

```javascript name=public/landing/script.js
// JavaScript code for future enhancements
```

## Step 3: Update the Express App

Modify `app.js` to serve the landing page as the default route.

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

// Landing page route
app.use('/', express.static(path.join(__dirname, 'public/landing')));

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

## Step 4: Test the Landing Page

1. Start your application by running:
   ```bash
   node app.js
   ```

2. Open your browser and navigate to `http://localhost:3000`. You should see the landing page with a navigation bar, hero section, and footer.

## Conclusion

You've now added a simple yet visually appealing front-end landing page to your web application using Node.js, Express, and MongoDB. This includes a navigation bar, hero section, and footer. You can expand and customize this further based on your needs.
