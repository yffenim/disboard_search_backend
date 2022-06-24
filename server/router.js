// ROUTING via express router
// CONTROLLER ACTIONS

// We need:
// GET route -> for autofill search function 
// POST route -> for getting user input for search tags


const express = require('express');
const router = express.Router();
const dbo = require('./connect');

// GET
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

module.exports = router;

