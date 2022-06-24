// CONTROLLER & ROUTER

const express = require('express');
const router = express.Router();
const dbo = require('./connect');
const spawn = require('child_process').spawn;
// const multer = require('multer');
// const upload = multer()
// GET ALL DOCUMENTS FROM COLLECTION
// need to figure out what is in the resp object 
// make it a POST 


router.route('/hello').get(async function (_req, res) {
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

// add a new doc into mongo -> cannot be same path as GET?
router.route("/add").post(function (req, res) {
  console.log(req.body);

  // const body = req.body;
  // console.log(typeof body);
  // res.json(req.body)

  // getting servers based on tag and page count
  // const getServers = spawn('python', 
  //   ['../scraper/scrape.py', 'buffy', '2']);

  // getServers.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });
  // getServers.stderr.on('data', (data) => {
  //   console.log(`stderr: ${data}`);
  // });
  // getServers.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });

  // const dbConnect = dbo.getDb();
  // const serverDoc = {
  //   "Server Name": "THIS IS A TEST"
  // };

  // dbConnect
  //   .collection("servers")
  //   .insertOne(serverDoc, function (err, result) {
  //     if (err) {
  //       res.status(400).send("Error inserting servers!");
  //     } else {
  //       console.log(`Added a new server with id ${result.insertedId}`);
  //       res.status(204).send();
  //     }
  //   });
});










module.exports = router;

