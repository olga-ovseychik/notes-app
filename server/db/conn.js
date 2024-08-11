import mongoose from 'mongoose';
const connectionString = process.env.ATLAS_URI;

try {
    mongoose.connect(connectionString);
  } catch (error) {
    console.error(error.message);
  }

const db = mongoose.connection;

db.on('error', (error) => console.log(`Failed to connect to the MongoDB. ${error}`));
db.once('open', () => console.log('Successfully connected to MongoDB.'));

export default db;
