const mongoose = require("mongoose");

// الاتصال ب Database
async function connectDatabase() {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
    console.log("connected to database");
  } catch (err) {
    console.log(`error for connect database ${err}`);
    process.exit(1);
  }
}

module.exports = connectDatabase;
