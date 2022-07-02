// SERVER + CONTROLLER

const app = require('./app').app;
// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });
// Load helper functions
const helpers = require('./helpers');
const formatServers = helpers.formatServers;
const filterServers = helpers.filterServers;

const express = require('express');

const spawn = require('child_process').spawn;
const pages = 5; // current default for n pages to scrape

// for MongoDB driver connection
const dbo = require('./connect');
const dbConnect = dbo.getDb();

// default to PORT 3333 and call express
const PORT = process.env.PORT || 3333;


////////// CONTROLLER ACTIONS //////////
app.get('/tags', async function (_req, res) {
  var collected_tags = []
  const dbConnect = dbo.getDb();
  const collection = dbConnect.collection('test_servers')

  // supposed to return only the tags but isn't working??
  collection
    .find()
    .project({ 
      '_id': 0, 
      'Tag 1': 1,
      'Tag 2': 1,
      'Tag 3': 1,
      'Tag 4': 1,
      'Tag 5': 1
      }
    )
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send(`Error fetching ${collectionName}`);
      } else {
        let tags = [];
        result.map(function(h) {
          Object.keys(h || {}).map(function(k) {
            tags.push(h[k])
          });
        });
        let uniqueTags = [...new Set(tags)];
        res.format({'application/json' () {
          res.json(uniqueTags);
          },
          default () {
            res.status(406).send('Not Acceptable')
          }
        });
      }
    });
});


// POST REQUEST FOR DYNAMIC SERVER SEARCH
app.post('/search', (req, res) => {
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
            res.status(406).send('Not Acceptable')}
          });
        });
        return 
      }
    }; // closing bracket for loop
  }; // closing bracket for scrapeData()

  scrapeData(arr, last, res);

}); // CLOSING TAG FOR POST REQUEST


////////// SERVER //////////
// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  };

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});



