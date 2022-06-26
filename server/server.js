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
  // console.log(arr[0]);
  // console.log(excludes);

  // var arr = [];

  // const tag = "buffy";

  // const scraper_process = spawn('python', ['../scraper/scrape.py', tag, pages]);
  // const last = spawn('python', ['../scraper/scrape.py', "charmed", pages]);
  // arr.push(scraper_process);
  // arr.push(last);

  var output;
  async function scrapeData (py, last, res) {
    output = '';

    // WHY DOES THE WHILE LOOP NOT WORK HERE???
    for (let i = 0; i < py.length; i++) {
      py[i].stdin.setEncoding = 'utf-8';
      py[i].stdout.on('data', (data) => {
        // console.log(typeof data);
        output += data.toString();
        // console.log(typeof output);
      });
    
      // Handle error output
      py[i].stderr.on('data', (data) => {
        console.log('error:' + data);
      });
    
        // send if last one
      if (py[i] === last) {
        console.log("*********ON THE LAST ONE: ", i);

        py[i].stdout.on('end', async function(code){
          console.log(`Exit code is: ${code}`);
          // send back to client
          res.format({'application/json' () {
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



    
  ////////////// USING SPAWN ////////////////
  // var final_servers = [];
  // scraper = spawn('python', ['../scraper/scrape.py']) 
  // scraper.stdout.on('data', function (data) {
  //    // QUESTION re: data vs ${data} here!!! 
  //     final_servers.push(`${data}`)
  //     console.log("final_servers: ", final_servers);
  //   });
  
  //   scraper.stderr.on('data', (data) => {
  //     console.log(`stderr: ${data}`);
  //   });
    
  //   scraper.on('close', (code) => {
  //     console.log(`child process exited with code ${code}`);
  //   });
  // child_process.exec(command[, options][, callback])



  /////////////// USING EXEC /////////////////
  // exec('python', ['../scraper/scrape.py'], (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  //   console.error(`stderr: ${stderr}`);
  // });

  // let scraper = spawn('python', ['../scraper/scrape.py', tag, pages]); 



  /////////////////////////////////////
 
  // so i think the issue is an async/await issue
  // because my console.logs run first 
  // then my scraper runs

    // make the servers array to be returned to user 
    // var final_servers = [];

    // function getServers() {
      // loop through user tags
      // let arr = [];
      // var i = 0, len = tags.length;
      // while (i < len) {
        // let tag = tags[0];
        // let pages = 2;
        
        // run the scraper
        // let scraper = spawn('python', ['../scraper/scrape.py', tag, pages]); 
        // console.log(scraper)
        
        // call function .on to access the output of scraper
        // scraper.stdout.on('data', function (data) {
          // arr.push(`${data}`);
          // console.log(`${data}`);
          // final_servers = await final_servers.push(`${data}`);
          // return final_servers;
          //return `${data}`
          // console.log("arr: ", arr);
          // console.log("final_servers: ", final_servers);
        // });
      // };

     // getServers();
     // console.log(test);
      // final_servers = await arr
      // console.log(final_servers);
      // return final_servers
    // };
   

    // console.log("final_servers after while loop: ", final_servers);
  // convert JS object to string
  // console.log("********FINAL_SERVERS:**** ", final_servers );
  // console.log(final_servers);
  // final_servers_str = JSON.stringify(final_servers)
  // console.log(final_string)
  // console.log("type of final_string...");
  // console.log(typeof final_servers_str)
  // console.log(final_servers_str);
  
  // res.status(200).send("I am a test");
  
  // sending servers back in JSON form
  // res.format({
  //   'application/json' () {
  //     // res.send(JSON.stringify(final_servers_str))
  //   },
  //   default () {
  //     res.status(406).send('Not Acceptable')
  //   }
  // });

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

