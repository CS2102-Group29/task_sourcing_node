const portNumber = 4000;

// configure express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// configure pg database connection
const { Client } = require('pg');
const databaseConfig = require('./config/database');
const client = new Client(databaseConfig);
client.connect();
// export the database client so that it can be used from other modules
module.exports = {
    dbClient: client
};

// connect to users route
const users = require('./routes/users');
app.use('/users', users);

// connect to tasks route
const tasks = require('./routes/tasks');
app.use('/tasks', tasks);

// connect to bids route
const bids = require('./routes/bids');
app.use('/bids', bids);

app.listen(portNumber, () => {
    console.log('Server is listening on port ' + portNumber);
});
