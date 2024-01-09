// require('dotenv').config({ path: './env' })
// the above method will work properely without any issue, the main issue in using this approach is that it reduces the code consistency..


import dotenv from "dotenv";
import connectDB from './db/index.js';
import { application } from "express";

dotenv.config({
  path: './env'
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 80001),
      () => { `server is running at port ${process.env.PORT}` }
  })
  .catch((err) => {
    console.log("MongoDB conection failes...", err);
  })




/*

Basic approach to database connectivity, this will work too without any issue !!

import express from "express";
const app = express()

 (async () => {
   try {
     await mongoose.connect(`${process.env.MONGODB_URl}/${DB_NAME}`)
     app.on("error", (error) => {
       console.log("ERROR:", error);
       throw error
     })
     app.listen(process.env.PORT, () => {
       console.log(`App is running on port ${process.env.PORT}`);
     })
   } catch (error) {
     console.error("Error:", error);
     throw error
   }
 })()

*/