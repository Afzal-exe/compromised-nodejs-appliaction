const express = require('express');
const compromise = require('infected-lib');  // Importing malicious package
const winston = require('winston'); // Import winston for logging
const app = express();
const port = process.env.PORT || 3000;

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

// Root endpoint
app.get('/', (req, res) => {
    // Trigger malicious behavior from the package
    compromise.attackSystem(logger);

    // Log suspicious activity
    logger.warn(`[ALERT] Malicious activity detected by 'infected-lib' at ${new Date()}`);

        res.send(`
        <h1>🚨 Warning: Your Web Application seems to be Infected! 🚨</h1>
        <p>Your System may be at risk. This application has been infiltrated by a Malacious package designed to steal sensitive information.</p>
        <p><strong>Malicious actions may include:</strong></p>
        <ul>
            <li>Creating unauthorized directories</li>
            <li>Storing sensitive credentials</li>
            <li>Scanning for vulnerabilities in your system</li>
        </ul>
        <p>Stay vigilant and monitor your environment closely! Use this as a training exercise to enhance your incident response skills.</p>
    `);
});

// Server listener
app.listen(port, () => {
    logger.info(`App is running on port ${port}`);
    logger.info(`[INFO] Application started successfully at ${new Date()}`);
});

