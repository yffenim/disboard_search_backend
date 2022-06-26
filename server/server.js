// ENTRY POINT, CONFIG INIT, ERROR HANDLING
// CONTROLLER IS NOW HERE BC COULD NOT OTHERWISE GET BODY-PARSER TO WORK

// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

var sys = require('util')
const express = require('express');
const cors = require('cors');

// for calling and parsing script
const bodyParser = require('body-parser');
// for calling python scraper script
const spawn = require('child_process').spawn;
// const { once } = require('events');
const pages = 2; // current default for n pages to scrape

// for MongoDB driver connection
const dbo = require('./connect');

// default to PORT 3333 and call express
const PORT = process.env.PORT || 3333;
const app = express();

app.use(cors());
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
  const json = req.body;
  // const tags = [["first array item"]];
  const tags = [];
  const excludes = []; 
  
  // save and get non-empty tags
  for (let key in json) {
    let value = json[key];
    if (value != "" && key.length < 5 ) {
      tags.push(value);
    } 
    else if ( value != "" && key.length > 4 ) {
      excludes.push(value);
    }
  };

  // make array of scraper processes by tag
  var arr = [];
  for (let i = 0; i < tags.length; i++) {
    let process = spawn('python', ['../scraper/scrape.py', tags[i], pages]);
    arr.push(process);
  };
  const last = arr[arr.length-1];

  // make return object containing scraped servers
  var output;
  async function scrapeData (py, last, res) {
    output = '';

    // WHY DOES MY OUTPUT CONTAIN TWO SETS OF EVERYTHING??
    for (let i = 0; i < py.length; i++) {
      py[i].stdin.setEncoding = 'utf-8';
      py[i].stdout.on('data', (data) => {
        // console.log(typeof data);
        output += data.toString();
        // console.log(output);
        // console.log(typeof output);
      });
    
      // Handle error output
      py[i].stderr.on('data', (data) => {
        console.log('error:' + data);
      });
    
      var a;
        // send if last one
      if (py[i] === last) {
        console.log("*********ON THE LAST ONE: ", i);

        py[i].stdout.on('end', async function(code){
          console.log(`Exit code is: ${code}`);
          // send back to client
          res.format({'application/json' () {
            // convert to JSON then sent
            // console.log("output before: ", output);
            // output.replace(/\[|\]/g,'').split(',')
            // console.log("ouput after: ", output);

            // res.send({output});
            res.send(JSON.stringify(output))
          },
            default () {
              res.status(406).send('Not Acceptable')
            }
          });
        });
        return 
      }
    }; // closing bracket for loop
  }; // closing bracket for scrapeData()

  scrapeData(arr, last, res);



// GET REQUEST FOR DEV
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

