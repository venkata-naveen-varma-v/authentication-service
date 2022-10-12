// imports
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const dotenv = require('dotenv');

dotenv.config();

const app = express()
const port = process.env.PORT || 3000;

// Routes
const routes = require('./src/routes/user')

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // Remove 
app.use(bodyParser.json());

// connect to db
const db = mysql.createConnection({
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

app.use(routes)

// Listen on enviroment port
app.listen(port, () => console.log(`Listening on port ${port}`))
