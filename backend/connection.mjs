import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// get serverless db connection string stored in .env file
dotenv.config({ path: "./config.env" });
const db_connection_str = process.env.ATLAS_URI;

const client = new MongoClient(db_connection_str);
 
let db;
const connectToServer = async (callback) => {
    try {
      await client.connect();
      console.log('Successfully connected to MongoDB ... ');
      // creates a new db called testing 
      db = client.db('testing');
      // creates a collection in testing
      const coll = db.collection("comets");
      const docs = [
        // {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
        // {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
        // {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12}
      ];
      const result = await coll.insertMany(docs);
      // display the results of your operation
      console.log(result.insertedIds);
    } catch (err) {
    console.error(err.message);
  }
}

const getDB = () => { return _db };

export const dbo = { connectToServer, getDB }