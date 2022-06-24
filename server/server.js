// ENTRY POINT, CONFIG INIT, ERROR HANDLING
// CONTROLLER IS NOW HERE BC COULD NOT OTHERWISE GET BODY-PARSER TO WORK

// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

var sys = require('util')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// for calling scripts 
const spawn = require('child_process').spawn;
// MongoDB driver connection
const dbo = require('./connect');
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
  const tags = [];
  const excludes = []; 
  var scraper = null; 
  var final_servers = [];
  
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
  // console.log(tags);
  // console.log(excludes);

  // get servers based on tag and page count
  function getServers(tag, pages=2) {
    console.log(`Getting servers for ${tag}`);
    scraper = spawn('python', ['../scraper/scrape.py', tag, pages]) 
  };

  // call getServers() for all tags 
    var i = 0, len = tags.length;
    while (i < len) {
        getServers(tags[i]);
        handleResponse()
        i++
    };
  // getServers(tags[0]);

  // saving return data of servers, error handling, closing process
  function handleResponse() {
  
    scraper.stdout.on('data', function (data) {
     // QUESTION re: data vs ${data} here!!! 
      final_servers.push(`${data}`)
      console.log("final_servers: ", final_servers);
    });

    scraper.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    
    scraper.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  };

  console.log(final_servers);
  
  // res.status(200).send("I am a test");
  
  // sending servers back in JSON form
  res.format({
    'application/json' () {
      res.send(JSON.stringify(final_servers))
    },
    default () {
      res.status(406).send('Not Acceptable')
    }
  });

});

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

