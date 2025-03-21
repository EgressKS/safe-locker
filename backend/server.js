const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/mysqlConfig');
const errorHandler = require('./middleware/errorhandler');
const userRouter = require('./router/userRouter');
const passwordRouter = require('./router/passwordRouter');
const fileMangerRouter = require("./router/fileMangerRouter");
const phoneBookRouter = require('./router/phoneBookRouter');
const passport = require('./config/passportConfig');
const sessionConfig = require('./config/sessionConfig');
const session = require('express-session');


// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle sessions
app.use(session(sessionConfig));
passport(app);

// Route to check server setup
app.get("/", (req, res) => {
    res.send({ message: "Set up" });
});

// Routers
app.use('/user', userRouter);
app.use('/pass', passwordRouter);
app.use('/file',fileMangerRouter)
app.use('/phone', phoneBookRouter);

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(process.env.SERVER_PORT_NUMBER, () => {
    console.log("Server is running!");
});
