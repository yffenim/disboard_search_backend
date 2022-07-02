const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// LOGGING
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
// app.use(morgan('combined'));
const appLogStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });
app.use(morgan('combined', { stream: appLogStream}));

// ERROR HANDLING
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!!');
});

app.use(cors());
// configure to accept JSON string literal
app.use(express.json({ strict: false }));
// parse POST req body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

module.exports.app = app;
