require('dotenv').config();
const PORT = process.env.PORT;
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database/db.js');
const routes = require('./routes/routes.js');
const auth = require('./routes/auth_router.js');
const dashboard_router = require('./routes/dashboard_router.js');
const tasks_router = require('./routes/tasks_router.js');


// Parsing json data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// app.use('/api', dashboard_router);

// Register and login routes 
app.use('/api/auth', auth);

// Dashboard route
app.use('/api', dashboard_router);

// Tasks route
app.use('/api/tasks', tasks_router);


db();
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}...`);
});


