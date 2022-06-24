// ENTRY POINT + CONFIG INIT

// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
// MongoDB driver connection
const dbo = require('./connect');

const PORT = process.env.PORT || 3333;
const app = express();

// for parsing POST req body
const multer = require('multer');
const upload = multer();

app.use(cors());
app.use(require('./router'));

// configure to accept JSON string literal
app.use(express.json({ strict: false }));

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

// Global error handling
app.use(function (err, _req, res) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!!');
});

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

