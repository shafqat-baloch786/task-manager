require("dotenv").config();

const PORT = process.env.PORT;
const express = require("express");
const app = express();
const cors = require("cors");

const db = require("./database/db.js");
const routes = require("./routes/routes.js");
const authRouter = require("./routes/authrouter.js");
const dashboardRouter = require("./routes/dashboardrouter.js");
const tasksRouter = require("./routes/tasksrouter.js");

// Parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Auth routes (register & login)
app.use("/api/auth", authRouter);

// Dashboard routes
app.use("/api", dashboardRouter);

// Tasks routes
app.use("/api/tasks", tasksRouter);

db();

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}...`);
});
