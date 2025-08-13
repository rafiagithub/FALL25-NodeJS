# Simple Social Media Application

This project is a simple social media application built using modern web technologies. Below is the setup guide, code structure, and instructions to get started.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Setup Guide](#setup-guide)
4. [Frontend Setup](#frontend-setup)
5. [Backend Setup](#backend-setup)
6. [Database Configuration](#database-configuration)

---

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Hosted on MongoDB Atlas)
- **Hosting**: Vercel (Frontend), Render/Heroku (Backend)

---

## Project Structure
```
social-media-app/
├── client/         # Frontend (React.js)
├── server/         # Backend (Node.js with Express.js)
└── README.md       # Instructions and documentation
```

---

## Setup Guide

### Prerequisites
1. **Node.js** and **npm** installed on your system.
2. A **MongoDB Atlas account** for hosting the database.
3. **Git** for version control.

---

## Frontend Setup

### 1. Initialize React App
Run the following commands to set up the frontend:
```bash
cd social-media-app
npx create-react-app client
cd client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### 2. Add Tailwind CSS Configurations
Update `tailwind.config.js`:
```javascript name=client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind imports in `index.css`:
```css name=client/src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Backend Setup

### 1. Initialize Express App
Run the following commands to set up the backend:
```bash
cd ..
mkdir server
cd server
npm init -y
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

### 2. Add Basic Express Server Code
Create `index.js`:
```javascript name=server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Sample Route
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media App API!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## Database Configuration

### 1. MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Get your connection string from the MongoDB dashboard.
3. Update the `.env` file with your connection string.

### 2. Create `.env` File
In the `server` directory, create a `.env` file:
```plaintext name=server/.env
MONGO_URI=your-mongodb-connection-string
PORT=5000
```

---

## Running the Application

### 1. Start the Backend
```bash
cd server
npm run dev
```

### 2. Start the Frontend
```bash
cd ../client
npm start
```

---

## Deployment

### Frontend
1. Push the `client` folder to a GitHub repository.
2. Deploy the `client` folder to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

### Backend
1. Push the `server` folder to a GitHub repository.
2. Deploy the `server` folder to [Render](https://render.com/) or [Heroku](https://www.heroku.com/).

---

## Please try intergrating following features once the basic application is developed. 
1. Add user authentication using Firebase or Auth0.
2. Create APIs for posts, comments, and likes.
3. Add real-time functionality for chat or notifications using Socket.IO.

Feel free to reach out if you encounter any issues or need further assistance!
