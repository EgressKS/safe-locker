require('dotenv').config();

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production' // Ensure this matches your deployment environment
    }
};

module.exports = sessionConfig;
