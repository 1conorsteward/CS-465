require('dotenv').config(); // Make sure to install and configure dotenv
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI; // Use environment variable
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
    return client.db('travlr');
  } catch (error) {
    console.error('Failed to connect to database', error);
  }
}

module.exports = connectToDatabase;