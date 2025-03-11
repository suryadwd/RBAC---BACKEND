const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = async () => {

  try {
    await mongoose.connect(process.env.MONGO_URI) 
    console.log('Database connected successfully')
  } catch (error) {
    console.log("Database connection failed")
    console.error(error)
    process.exit(1) // the app will not run if there is an error in connecting to the database
  }

}

module.exports = dbConnect;