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
// const exec = require('child_process').exec;
const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);



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
  // var final_servers = [];
  
  // save and get non-empty tags
  // for (let key in json) {
  //   let value = json[key];
  //   if (value != "" && key.length < 5 ) {
  //     tags.push(value);
  //   } 
  //   else if ( value != "" && key.length > 4 ) {
  //     excludes.push(value);
  //   }
  // };
  const tag = "buffy"
  const pages = "2"
  // save the process return from spawn calling scraper
  const scraped_process = spawn('python', ['../scraper/scrape.py', tag, pages]);
  // get the required output from completed process
  function getStdout(process) {
    // let result;
    try {
      process.stdout.on('data', function (data) {
        // console.log(`stdout: ${data}`);
        stdout = `${data}`;
        console.log("stdout: ", stdout);
        return stdout;
        // return stdout;
        // result = await final_server.push(`${data}`)
      });
    } catch (err) {
      return err;
    }
    // return result
  }

  // call it asynchronously 
  async function asyncWrapper() {
    let result = await getStdout(scraped_process);
    console.log(result)
  }

  asyncWrapper();



  // runScraper().then(res => console.log("result: ", res) );
    
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
  // console.log(tags);
  // console.log(excludes);
 
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
  res.format({
    'application/json' () {
      // res.send(JSON.stringify(final_servers_str))
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

