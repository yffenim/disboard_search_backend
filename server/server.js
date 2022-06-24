// ENTRY POINT + CONFIG INIT
// CONTROLLER IS NOW HERE BC COULD NOT OTHERWISE GET BODY-PARSER TO WORK

// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// MongoDB driver connection
const dbo = require('./connect');

const PORT = process.env.PORT || 3333;
const app = express();

app.use(cors());
// app.use(require('./router'));

// configure to accept JSON string literal
app.use(express.json({ strict: false }));

// parse POST req body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 


////////// CONTROLLER ACTIONS //////////

// POST REQUEST
app.post('/add', (req, res) =>{
  console.log(req.body);
  res.status(200).send('Post Success');

// get the tags, add it into the py script 
// return the array to FE

});


// GET REQUEST FOR SERVERS //
// this will be removed
app.get('/hello', async function (_req, res) {
  const dbConnect = dbo.getDb();
  collectionName = 'servers';

  dbConnect
    .collection(collectionName)
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send(`Error fetching ${collectionName}`);
      } else {
        res.json(result);
      }
    });
});


//////////  Global error handling  //////////
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

