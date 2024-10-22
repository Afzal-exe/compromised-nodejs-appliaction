const express = require('express');
const compromise = require('infected-lib');  // Importing malicious package
const winston = require('winston'); // Import winston for logging
const app = express();
const port = process.env.PORT || 3000;

// Mocking the malicious functions if they don't exist
if (!compromise.storeCredentials) {
    compromise.storeCredentials = (logger) => {
        logger.warn(`[ALERT] Unauthorized storage of credentials detected at ${new Date()}`);
    };
}

if (!compromise.createUnauthorizedDirectory) {
    compromise.createUnauthorizedDirectory = (logger) => {
        logger.warn(`[ALERT] Unauthorized directory creation detected at ${new Date()}`);
    };
}

// Configure the logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'combined.log' }) // Log to a file
    ]
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
    logger.info(`[INFO] Request received at ${new Date()}: ${req.method} ${req.url}`);
    next();
});

// Root endpoint with interactive content
app.get('/', (req, res) => {
    // Log the homepage access
    logger.info("[INFO] Serving homepage with interactive content");
    
    res.send(`
        <h1>🚨 Warning: Your Web Application seems to be Infected! 🚨</h1>
        <p>Your System may be at risk. This application has been infiltrated by a Malicious package designed to steal sensitive information.</p>
        <p><strong>Malicious actions may include:</strong></p>
        <ul>
            <li>Creating unauthorized directories</li>
            <li>Storing sensitive credentials</li>
            <li>Scanning for vulnerabilities in your system</li>
        </ul>
        <form method="POST" action="/simulate">
            <button type="submit">Simulate Malicious Activity</button>
        </form>
        <p>Stay vigilant and monitor your environment closely! Use this as a training exercise to enhance your incident response skills.</p>
    `);
});

// Endpoint to simulate malicious activity
app.post('/simulate', (req, res) => {
    // Trigger malicious behavior from the package
    compromise.storeCredentials(logger);
    compromise.createUnauthorizedDirectory(logger);

    res.send(`
        <h1>🚨 Malicious Activity Simulated! 🚨</h1>
        <p>Unauthorized directory created and credentials stored. Logs have been generated for analysis.</p>
    `);
});

// Server listener
app.listen(port, () => {
    logger.info(`App is running on port ${port}`);
    logger.info(`[INFO] Application started successfully at ${new Date()}`);
});
