//initialize database by running this file to show sample datas
require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); //.. meaning “Start from where I am, go up one folder, then into the models folder, and grab listing.js.”
const initData = require("./data.js"); //returns obj

// let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
//mongoose connection to mongodb
main()
  .then(() => {
    console.log("Connected to database!");
    initDB();
  })
  .catch(() => console.log("unable to connect to database"));

async function main() {
  await mongoose.connect(process.env.ATLAS_DB_URL);
}

let initDB = async () => {
  await Listing.deleteMany({}); //empty db before initailzation
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "690be7b9ddbcf4ce7cc563b9",
  }));
  await Listing.insertMany(initData.data); //insert all data from data file which contains arr of objs

  console.log("data was initialized");
};


//The dotenv package is used in Node.js  projects to load environment variables from a .env file into process.env.