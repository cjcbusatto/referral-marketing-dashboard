const compression = require('compression');
const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');

// Include authentication
require('./authentication/auth');

// Read environment configuration
require('dotenv').config();
const { PROD_DB, TEST_DB } = process.env;

const app = express();
const server = require('http').Server(app);

// Connect to the database

// (node:24160) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);

const databaseUrl = process.env.NODE_ENV === 'test' ? TEST_DB : PROD_DB;
mongoose.connect(databaseUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Include middlewares
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(routes);

// Initialize the server
const port = process.env.PORT || 8080;
server.listen(port);

module.exports = server;
