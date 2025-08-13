# Pets App: Full-Stack Application with Node.js, Express, MongoDB, and Frontend

This application allows users to manage pet data with full CRUD (Create, Read, Update, Delete) functionality. The app includes a backend API built with Node.js and Express, a MongoDB database for data storage, and a simple frontend for user interaction.

---

## Project Structure

```
pets-app/
├── server.js
├── package.json
├── routes/
│   └── pets.js
├── models/
│   └── Pet.js
├── public/
│   ├── index.html
│   ├── create.html
│   ├── update.html
│   └── style.css
```

---

## 1. Backend: `server.js`

The main server file sets up the Express server and connects to MongoDB.

```javascript name=server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/petsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const petsRoutes = require('./routes/pets');
app.use('/api/pets', petsRoutes);

// Serve frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## 2. MongoDB Model: `Pet.js`

Define the schema for the pets collection in MongoDB.

```javascript name=models/Pet.js
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    type: { type: String, required: true }, // e.g., Dog, Cat
    owner: { type: String, required: true }
});

module.exports = mongoose.model('Pet', PetSchema);
```

---

## 3. Routes: CRUD Operations in `pets.js`

This file contains all the endpoints for managing pet data.

```javascript name=routes/pets.js
const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// Create a new pet
router.post('/', async (req, res) => {
    try {
        const pet = new Pet(req.body);
        await pet.save();
        res.status(201).json({ message: 'Pet added successfully', pet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all pets
router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single pet by ID
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a pet by ID
router.put('/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.json({ message: 'Pet updated successfully', pet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a pet by ID
router.delete('/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

---

## 4. Frontend Pages

### a. `index.html` - List Pets

```html name=public/index.html
<!DOCTYPE html>
<html>
<head>
    <title>Pets App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Pets List</h1>
    <div id="pets-container"></div>
    <a href="create.html">Add New Pet</a>

    <script>
        fetch('/api/pets')
            .then(res => res.json())
            .then(pets => {
                const container = document.getElementById('pets-container');
                pets.forEach(pet => {
                    const petDiv = document.createElement('div');
                    petDiv.innerHTML = `
                        <h3>${pet.name}</h3>
                        <p>Type: ${pet.type}</p>
                        <p>Age: ${pet.age}</p>
                        <p>Owner: ${pet.owner}</p>
                        <a href="update.html?id=${pet._id}">Edit</a>
                        <button onclick="deletePet('${pet._id}')">Delete</button>
                    `;
                    container.appendChild(petDiv);
                });
            });

        function deletePet(id) {
            fetch(`/api/pets/${id}`, {
                method: 'DELETE'
            }).then(() => window.location.reload());
        }
    </script>
</body>
</html>
```

---

### b. `create.html` - Add New Pet

```html name=public/create.html
<!DOCTYPE html>
<html>
<head>
    <title>Add Pet</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Add New Pet</h1>
    <form id="create-form">
        <input type="text" name="name" placeholder="Name" required />
        <input type="number" name="age" placeholder="Age" required />
        <input type="text" name="type" placeholder="Type (Dog, Cat, etc.)" required />
        <input type="text" name="owner" placeholder="Owner Name" required />
        <button type="submit">Add</button>
    </form>

    <script>
        document.getElementById('create-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            fetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).then(() => window.location.href = '/');
        });
    </script>
</body>
</html>
```

---

### c. `update.html` - Edit Pet

```html name=public/update.html
<!DOCTYPE html>
<html>
<head>
    <title>Update Pet</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Update Pet</h1>
    <form id="update-form"></form>

    <script>
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        fetch(`/api/pets/${id}`)
            .then(res => res.json())
            .then(pet => {
                const form = document.getElementById('update-form');
                form.innerHTML = `
                    <input type="text" name="name" value="${pet.name}" required />
                    <input type="number" name="age" value="${pet.age}" required />
                    <input type="text" name="type" value="${pet.type}" required />
                    <input type="text" name="owner" value="${pet.owner}" required />
                    <button type="submit">Update</button>
                `;

                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    fetch(`/api/pets/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    }).then(() => window.location.href = '/');
                });
            });
    </script>
</body>
</html>
```

---

### d. `style.css` - Basic Styling

```css name=public/style.css
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

h1 {
    color: #333;
}

form {
    margin-bottom: 20px;
}

form input, form button {
    margin: 5px 0;
    display: block;
}
```

---

## 5. Install Dependencies

Run the following commands:
```bash
npm init -y
npm install express mongoose body-parser
```

---

## 6. Run the Application

Start the server with:
```bash
node server.js
```

Visit `http://localhost:3000` to view your app!

---


Good Luck!
