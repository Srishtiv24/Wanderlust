//initialize database by running this file to show sample datas 

const mongoose=require("mongoose");
const Listing=require("../models/listing.js");//.. meaning “Start from where I am, go up one folder, then into the models folder, and grab listing.js.”
const initData=require("./data.js");//returns obj

let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
//mongoose connection to mongodb
main()
.then(() => console.log('Connected to database!'))
.catch(()=>console.log('unable to connect to database'));

async function main()
{ await mongoose.connect(MONGO_URL);
}

let initDB= async ()=>
{
   await Listing.deleteMany({});//empty db before initailzation
   initData.data=initData.data.map((obj)=>({...obj,owner:'69037bd49f2f64c3a3100ddf'}));
   await Listing.insertMany(initData.data);//insert all data from data file which contains arr of objs
   
   console.log("data was initialized");
}

module.exports={initDB};