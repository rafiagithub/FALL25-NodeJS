# Full Stack Weather Application

This project is a full-stack Node.js application with a React frontend and an Express backend, integrated with MongoDB Atlas and OpenWeather API. The application enables users to fetch and save weather data for cities and is fully deployed on Vercel.

---

## Features

- **Backend**: Built with Express.js, integrates MongoDB Atlas for data storage.
- **Frontend**: Built with React.js to interact with the backend API.
- **API Integration**: Fetches real-time weather data from the OpenWeather API.
- **Deployment**: Fully deployed on Vercel for both frontend and backend.

---

## Prerequisites

1. **Node.js** (v14 or later)
2. **MongoDB Atlas** account for cloud database ([Sign up here](https://www.mongodb.com/cloud/atlas)).
3. **OpenWeather API Key** ([Get your API key here](https://openweathermap.org/api)).
4. **Vercel CLI** for deployment ([Install it here](https://vercel.com/cli)).

---

## Project Structure

The project consists of two folders:
1. `backend`: Contains the Express server and MongoDB integration.
2. `frontend`: Contains the React application for the user interface.

Both folders are deployed separately on Vercel.

---

## Step 1: Backend Setup

### 1. Create the Backend Folder

Create a folder named `backend`, then navigate into it:
```bash
mkdir backend
cd backend
```

### 2. Initialize the Node.js Project

Run the following commands to initialize the project and install required packages:
```bash
npm init -y
npm install express mongoose axios cors dotenv
```

### 3. Create the Server File

Create a file named `server.js` in the `backend` folder and add the following code:

```javascript name=backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Weather Schema
const WeatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  description: String,
  date: { type: Date, default: Date.now },
});

const Weather = mongoose.model("Weather", WeatherSchema);

// Routes
// Fetch weather from OpenWeather API and save to MongoDB
app.post("/api/weather", async (req, res) => {
  const { city } = req.body;

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const { temp } = response.data.main;
    const { description } = response.data.weather[0];

    const weather = new Weather({ city, temperature: temp, description });
    await weather.save();

    res.status(200).json(weather);
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// Retrieve data from MongoDB
app.get("/api/weather", async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving weather data" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 4. Add Environment Variables

Create a `.env` file in the `backend` folder and add the following variables:
```plaintext
MONGO_URI=your_mongodb_atlas_connection_string
WEATHER_API_KEY=your_openweather_api_key
PORT=5000
```

Replace `your_mongodb_atlas_connection_string` and `your_openweather_api_key` with your actual MongoDB Atlas connection string and OpenWeather API key.

---

### 5. Test the Backend Locally

Start the server:
```bash
node server.js
```

Test the endpoints using a tool like Postman or curl:
- **POST /api/weather**: Add a city and fetch its weather data.
- **GET /api/weather**: Retrieve all saved weather data.

---

## Step 2: Frontend Setup

### 1. Create the Frontend Folder

In the root directory, create a folder named `frontend` and navigate into it:
```bash
npx create-react-app frontend
cd frontend
npm install axios
```

### 2. Update the App Component

Replace the content of `src/App.js` with the following code:

```javascript name=frontend/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/weather");
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleAddCity = async () => {
    try {
      await axios.post("http://localhost:5000/api/weather", { city });
      setCity("");
      fetchWeatherData();
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weather App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>
      <h2>Weather Data</h2>
      <ul>
        {weatherData.map((data, index) => (
          <li key={index}>
            <strong>{data.city}</strong>: {data.temperature}°C, {data.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```

---

### 3. Test the Frontend Locally

Start the development server:
```bash
npm start
```

---

## Step 3: Deployment on Vercel

### Backend Deployment

1. Add a `vercel.json` file in the `backend` directory:
```json name=backend/vercel.json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

2. Deploy the backend:
```bash
cd backend
vercel
```

---

### Frontend Deployment

1. Deploy the React app:
```bash
cd frontend
vercel
```

---

### Set Environment Variables in Vercel

Go to the Vercel dashboard and add the following environment variables under **Project Settings** > **Environment Variables** for the backend:
- **MONGO_URI**
- **WEATHER_API_KEY**

---

### Final Steps

1. Access the deployed frontend and backend URLs from Vercel.
2. Update the frontend API calls to use the deployed backend URL instead of `http://localhost:5000`.

