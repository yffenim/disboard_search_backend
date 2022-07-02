// CONNECTION TO DB, SET TO ATLAS
const { MongoClient } = require('mongodb');

const connectionString = process.env.ATLAS_URI;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }
      dbName = 'discord' 
      // connect to the discord db 
      dbConnection = db.db(dbName);
      console.log(`Successfully connected to ${dbName}`);

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};

