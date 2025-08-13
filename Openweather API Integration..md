# Create a Simple Node.js Application with API Integration

This guide walks you through the steps to create a simple Node.js application and integrate an API.

---

## Step 1: Set Up Your Development Environment

1. Ensure **Node.js** and **npm (Node Package Manager)** are installed on your computer.
   - You can download Node.js from [nodejs.org](https://nodejs.org/).

2. Verify the installation:
   ```bash
   node -v
   npm -v
   ```

---

## Step 2: Initialize a New Node.js Project

1. Create a project folder:
   ```bash
   mkdir my-node-api-app
   cd my-node-api-app
   ```

2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```
   This will generate a `package.json` file.

---

## Step 3: Install Required Packages

1. Install `express` for creating a server:
   ```bash
   npm install express
   ```

2. Install `axios` for making API requests:
   ```bash
   npm install axios
   ```

---

## Step 4: Write the Code

Create a simple application that integrates an external API (e.g., OpenWeather API).

### Create the Files

1. Create an `index.js` file as the entry point of the application.

2. Write the code in the `index.js` file:

```javascript name=index.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Replace with your API key from OpenWeatherMap
const API_KEY = 'your_openweather_api_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Middleware to parse JSON
app.use(express.json());

// Route to fetch weather details for a city
app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).send({ error: 'City is required as a query parameter.' });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric', // Temperature in Celsius
            },
        });

        return res.json(response.data);
    } catch (error) {
        console.error(error.message);

        if (error.response) {
            return res.status(error.response.status).send({ error: error.response.data });
        }

        return res.status(500).send({ error: 'An error occurred while fetching weather data.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Step 5: Run Your Application

1. Start the application:
   ```bash
   node index.js
   ```

2. The server will start on `http://localhost:3000`.

---

## Step 6: Test the Application

1. Use a browser or a tool like [Postman](https://www.postman.com/) to test the API.

2. Make a GET request to:
   ```
   http://localhost:3000/weather?city=London
   ```

3. You should receive weather details for the city.

---

## Step 7: Environment Variables (Optional but Recommended)

1. Store sensitive data like API keys in an `.env` file:
   ```bash
   npm install dotenv
   ```

2. Create a `.env` file in the root directory:
   ```
   API_KEY=your_openweather_api_key
   ```

3. Update the code to use `dotenv`:

```javascript
require('dotenv').config();
const API_KEY = process.env.API_KEY;
```

---


