// require('dotenv').config({path:'./env'})

import dotenv from 'dotenv'



// import mongoose from "mongoose";
// import {DB_NAME} from "./constants"
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

// Because connectDB is an async function
connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000 ,()=>{
    console.log(`Server is running at Port ${process.env.PORT}`)
  })
  app.on("error",()=>{
    console.log("ERRR: ",error)
    throw error
  })
})
.catch((err)=>{
  console.log("MONGO DB CONNECTION FAILED !!! ",err)
})






/*
import express from "express"
const app = express()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",()=>{
        console.log("ERRR: ",error)
        throw error
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is Listening on Port ${process.env.PORT}`)
    })

  } catch (error) {
    console.error("ERROR", error);
    throw error;
  }
})();

*/