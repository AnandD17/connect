import express  from "express"
import  dotenv  from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
dotenv.config();
const app=express()
import cookieParser from "cookie-parser"

import router from  "./routes/index.js"

import schedule from 'node-schedule'
import controller from "./controllers/index.js";
const {dataController} = controller;

const job = schedule.scheduleJob('1 * * * * *', function(){
    dataController.CheckConnectExpiry();
  });


//cookies and filemiddleware
app.use(cors())
app.use(cookieParser())


// morgan middlewares
import morgan from "morgan"
app.use(morgan("tiny"))

// regular middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// import all routes here
// import userRoutes from "./routes/userRoutes.js"

// router middleware
app.use(router);


export default app;