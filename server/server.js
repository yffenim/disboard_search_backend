// ENTRY POINT, CONFIG INIT, ERROR HANDLING
// CONTROLLER IS NOW HERE BC COULD NOT OTHERWISE GET BODY-PARSER TO WORK

// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

// Load helper functions
const helpers = require('./helpers');
// const stringToHash = helpers.stringToHash;
const formatServers = helpers.formatServers;
const filterServers = helpers.filterServers;

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
const dbConnect = dbo.getDb();

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
app.post('/add', (req, res) => {
  const json = req.body;
  const tags = [];
  const exclusion_tags = []; 
  var arr = [];
  var output;

  // save and get non-empty tags
  for (let key in json) {
    let value = json[key];
    if (value != "" && key.length < 5 ) {
      tags.push(value);
    } 
    else if ( value != "" && key.length > 4 ) {
      exclusion_tags.push(value);
    }
  };

  // make array of scraper processes by tag
  for (let i = 0; i < tags.length; i++) {
    let process = spawn('python', ['../scripts/scrape.py', tags[i], pages, 'server']);
    arr.push(process);
  };
  const last = arr[arr.length-1];


  // make return object containing scraped servers
  async function scrapeData (py, last, res) {
    output = '';
    // WHY DOES MY OUTPUT CONTAIN TWO SETS OF EVERYTHING??
    for (let i = 0; i < py.length; i++) {
      py[i].stdin.setEncoding = 'utf-8';
      py[i].stdout.on('data', (data) => {
        output += data.toString();
      });
    
      // Handle error output
      py[i].stderr.on('data', (data) => {
        console.log('error:' + data);
      });
    
      // remove excluded and sent to client if last one
      if (py[i] === last) {
        console.log("*********ON THE LAST ONE: ", i);

        py[i].stdout.on('end', async function(code){
          console.log(`Exit code is: ${code}`);
          // console.log(output);
          
          // convert string server data into hash objects
          var formatted_servers = formatServers(output);
          // console.log(typeof included_servers);
          
          // filter out the excluded servers by tag 
          var final_servers = filterServers(formatted_servers, exclusion_tags);
          console.log("final_servers: ", final_servers);

          // send back to client
          res.format({'application/json' () {
            res.send(JSON.stringify(final_servers))
            // res.send(JSON.stringify(included_servers))
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

  // CHANGE THIS () NAME
  scrapeData(arr, last, res);

}); // CLOSING TAG FOR POST REQUEST





//////////////////// LEARNING NOTES - TO BE REMOVED ////////////////
app.post('/post', async function (req, res) {
  const dbConnect = dbo.getDb();
  const serverDoc = {
    "Server Name": "THIS IS A TEST"
  };

  dbConnect
    .collection("servers")
    .insertOne(serverDoc, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting servers!");
      } else {
        console.log(`Added a new server with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});



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



