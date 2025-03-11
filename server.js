require("dotenv").config();  //dotenv
const express = require("express"); //express
const app = express() //store the express in app 
const cors = require("cors") //cross orgin resource sharing ke liye
const session = require("express-session") //session banana insted of using jwt
const redisClient = require("./config/redisdb") //redis ko import kiya config 
const dbConnect = require("./config/mongodb")

const {RedisStore} = require("connect-redis")  //redis ko import karne ke liye


const authRoute = require("./route/auth.route")

app.use(express.json()) //json dataset accept krne ke liye

app.use(cors({ credentials:true, origin:"http://localhost:3000"})) //cors allow krne ke liye 3000 port per


//session middleware redis ke liye

app.use(session({
  store: new RedisStore({ client: redisClient}), //db ko connect kiya using redisdb creted under configjs
  secret : process.env.SESSION_SECRET, //secret keyword for adding the security
  resave:false,
  saveUninitialized:false,
  cookie:{secure:false, httpOnly:true, maxAge: 2*60*60*1000} //2 hrs ke liye valid rahega
}))

//routes 
app.use("/api/auth",authRoute)
app.get("/", (req, res) => {
  res.send("you are on homepage check the readme.md file for more")
})

const PORT = process.env.PORT || 5000 

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`)
  dbConnect()
})

