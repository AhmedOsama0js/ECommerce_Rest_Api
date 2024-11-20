const mongoose = require("mongoose");

//Contact Database
async function connectDatabase() {
  await mongoose.connect(`${process.env.DB_URL}`);
  console.log("connected to database");
}

module.exports = connectDatabase;
