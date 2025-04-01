const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const dbConfig = require('./config/dbConfig');

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Connect to the database
sql.connect(dbConfig, (err) => {
    if (err) {
        console.error('Database connection failed: ', err);
        process.exit(1);
    }
    console.log('Connected to Azure SQL Database');
});

// Routes
const complaintsRoutes = require('./routes/complaints');
const resolutionsRoutes = require('./routes/resolutions');
const uploadsRoutes = require('./routes/uploads');
const resolutionsHistoryRoutes = require('./routes/resolutionsHistory');

app.use('/complaints', complaintsRoutes);
app.use('/resolutions', resolutionsRoutes);
app.use('/uploads', uploadsRoutes);
app.use('/resolutions_history', resolutionsHistoryRoutes);

// Define a test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Authentication route
app.post('/user/login', async (req, res) => {
    const {user_name, password} = req.body;

    try {
        // Query the Users table for the username and password
        const result = await sql.query`SELECT *
                                       FROM dbo.Users
                                       WHERE user_name = ${user_name}
                                         AND password = ${password}`;

        if (result.recordset.length > 0) {
            // User found, attach user details to request object and proceed
            // req.user = result.recordset[0];
            res.status(200).json(result.recordset[0]);
        } else {
            // User not found, return error
            res.status(401).json({message: 'Invalid credentials'});
        }
    } catch (err) {
        console.error('Database query failed: ', err);
        res.status(500).json({message: 'Internal server error'});
    }
});


app.post('/user/register', async (req, res) => {
    const {user_name, password} = req.body;

    if (!user_name || !password) {
        return res.status(400).json({error: 'Missing required fields'});
    }
    try {
        // Query the Users table for the username and password
        await sql.query`
            INSERT INTO dbo.Users (user_name, password)
            VALUES (${user_name}, ${password})
        `;
        res.status(201).json({message: 'User registered successfully'});
    } catch (err) {
        console.error('Error registering user into the database: ', err);
        res.status(500).json({error: 'Error creating user in the database'});
    }
});


// Test Endpoint
app.post('/test', async (req, res) => {
    const {query} = req.body;
    if (!query) {
        return res.status(400).json({error: 'Query is required'});
    }
    try {
        const result = await sql.query(query);
        // Send the result as a JSON response
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).json({error: 'Error executing the query', details: err.message});
    }
});


// Web-Socket Start
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New client connected');

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
    });
});

exports.notifyClients = (complaint) => {
    clients.forEach(client => {
        client.send(JSON.stringify({
            message: `New complaint received: ${complaint.id}`,
            complaintId: complaint.id,
        }));
    });
};


// Web-Socket End

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});