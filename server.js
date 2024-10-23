const express = require("express");
const dotenv = require("dotenv");
const morgen = require("morgan");
const categoryRouts = require("./Routes/CategoryRoute");
const connectDatabase = require("./Config/dbConfig");

//  تعريف الملف ال  config
dotenv.config({ path: "config.env" });

// انشاء ال app من express
const app = express();

// الاتصال ب Database
connectDatabase()


// middlewares========================================================================================================

app.use(express.json());

//شرط تشغيل ال nodemon  في ال dev mode

if (process.env.NODE_MODE) {
  app.use(morgen("dev"));
  console.log(`node mode is ${process.env.NODE_MODE}`);
}

app.use("/api/v1/category", categoryRouts);

// تعريف ال port الخاص بالسيرفر
const PORT = process.env.PORT || 5005;

// الاستماع الي ال port
app.listen(PORT, () => {
  console.log(`server run to port ${PORT}`);
});
