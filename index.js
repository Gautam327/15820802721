const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

let windowSize = 10;
let numbersWindow = [];

// Function to fetch numbers from an external API based on type
const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(`http://20.244.56.144/test/${type}`, { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error);
        return [];
    }
};

// Function to calculate average of numbers in an array
const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

// Basic Authentication Middleware
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Add your own logic here for username and password verification

    next();
};

// Middleware to handle basic authentication for all routes
app.use(basicAuth);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle fetching numbers based on type
app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;
    const validTypes = ['primes', 'fibo', 'even', 'rand'];

    // Validate the type of number requested
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    // Fetch numbers based on the type from external API
    const numbers = await fetchNumbers(type);

    // Save previous state of the numbers window
    const windowPrevState = [...numbersWindow];
    
    // Update numbers window with new unique numbers and maintain window size
    for (let number of numbers) {
        if (!numbersWindow.includes(number)) {
            if (numbersWindow.length >= windowSize) {
                numbersWindow.shift();
            }
            numbersWindow.push(number);
        }
    }

    // Save current state of the numbers window
    const windowCurrState = [...numbersWindow];

    // Calculate average of numbers in the window
    const average = calculateAverage(numbersWindow);

    // Return response with previous and current window state, fetched numbers, and average
    return res.json({
        windowPrevState,
        windowCurrState,
        numbers,
        avg: average.toFixed(2)
    });
});

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
