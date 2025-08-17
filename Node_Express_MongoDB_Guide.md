# Node.js + Express + MongoDB Project Guide (Detailed for Students)

##  Overview
This guide will teach you how to build a **backend REST API** using:  
- **Node.js** → JavaScript runtime for backend  
- **Express** → Web framework for handling HTTP requests  
- **MongoDB (via Mongoose)** → NoSQL database for storing data  

By the end, you’ll be able to:  
✅ Create an Express server  
✅ Connect it to MongoDB  
✅ Build REST APIs for **CRUD** (Create, Read, Update, Delete)  
✅ Test APIs with Postman  

---

## 🛠 Prerequisites
Before starting, make sure you have:  
- [Node.js](https://nodejs.org/) installed (LTS recommended)  
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally OR an account on [MongoDB Atlas](https://www.mongodb.com/atlas)  
- Basic knowledge of **JavaScript functions and objects**  
- Postman or any REST client for testing  

---

##  Step 1: Create Project Folder
```bash
mkdir myapp && cd myapp
npm init -y
```

**Explanation**  
- `mkdir myapp` → create new folder  
- `cd myapp` → go into folder  
- `npm init -y` → create a default `package.json` file (stores project info and dependencies)  

---

## Step 2: Install Dependencies
```bash
npm install express mongoose dotenv cors
npm install --save-dev nodemon
```

**Explanation**  
- `express` → helps create routes and handle HTTP requests easily  
- `mongoose` → connects Node.js to MongoDB and lets us define schemas  
- `dotenv` → loads environment variables from `.env` file (like passwords, URLs)  
- `cors` → allows frontend apps (like React) to talk to backend safely  
- `nodemon` → restarts server automatically when code changes  

---

##  Step 3: Update `package.json` Scripts
Inside `package.json`, add scripts:
```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

**Explanation**  
- `npm start` → runs the server normally  
- `npm run dev` → runs with `nodemon` (better for development)  

---

##  Step 4: Setup Environment Variables
Create a file `.env` in the project root:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/myapp
```

**Explanation**  
- `PORT=5000` → tells server to run on port 5000  
- `MONGO_URI` → local MongoDB connection string (use Atlas URI if using cloud)  

---

##  Step 5: Connect to MongoDB
Create `src/config/db.js`
```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**Explanation**  
- `mongoose.connect` → connects Node.js to MongoDB  
- `process.env.MONGO_URI` → loads DB URL from `.env`  
- `try/catch` → handles errors gracefully  
- `process.exit(1)` → stops app if DB connection fails  

---

## 🌐 Step 6: Create Express Server
Create `src/app.js`
```js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());            // Allow cross-origin requests
app.use(express.json());    // Parse JSON request bodies

// Connect Database
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

**Explanation**  
- `require("dotenv").config()` → load environment variables  
- `app.use(cors())` → allow frontend to access backend  
- `app.use(express.json())` → lets us send JSON in requests (like `{name: "Rafia"}`)  
- `/api/users` → all user routes will start with this prefix  

---

##  Step 7: Create a User Model
Create `src/models/User.js`
```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
```

**Explanation**  
- **Schema** → defines how data looks in MongoDB  
- `name` → string, required  
- `email` → unique and required  
- `createdAt` → automatically set to current date  

---

## Step 8: Create Controller Functions
Create `src/controllers/userController.js`
```js
const User = require("../models/User");

// @desc Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Create new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
```

**Explanation**  
- `User.find()` → fetches all users from DB  
- `User.create(req.body)` → saves a new user using request body data  
- `res.status(201)` → status code for "Created"  
- Error handling added for safety  

---

##  Step 9: Add Routes
Create `src/routes/userRoutes.js`
```js
const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");

// GET /api/users
router.get("/", getUsers);

// POST /api/users
router.post("/", createUser);

module.exports = router;
```

**Explanation**  
- `router.get("/", getUsers)` → When GET request is made to `/api/users`, call `getUsers`  
- `router.post("/", createUser)` → When POST request is made, create a new user  

---

##  Step 10: Test with Postman
1. Start server:
   ```bash
   npm run dev
   ```
2. Open Postman and test:
   - `GET http://localhost:5000/api/users` → should return list of users (empty at first)  
   - `POST http://localhost:5000/api/users` with body:
     ```json
     {
       "name": "Rafia",
       "email": "rafia@example.com"
     }
     ```
   → should create a new user  

---

## ✅ Next Steps (For Students to Try)
- Add **Update (PUT)** and **Delete (DELETE)** routes  
- Add input validation with `express-validator`  
- Add authentication with **JWT (JSON Web Token)**  
- Deploy backend on **Render / Vercel / Heroku**  
- Use **MongoDB Atlas** instead of local MongoDB  
