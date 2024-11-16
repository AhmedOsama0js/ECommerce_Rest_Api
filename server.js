const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgen = require("morgan");

const mountsRoutes = require("./Routes/index");

const connectDatabase = require("./Config/dbConfig");
const ApiError = require("./utils/ApiError");
const globalError = require("./middleware/errorMiddleware");

//  تعريف الملف ال  config
dotenv.config({ path: "config.env" });

// انشاء ال app من express
const app = express();

// الاتصال ب Database
connectDatabase();

// middlewares========================================================================================================

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
//شرط تشغيل ال nodemon  في ال dev mode

if (process.env.NODE_MODE) {
  app.use(morgen("dev"));
  console.log(`node mode is ${process.env.NODE_MODE}`);
}

//  routes ==========================================================================================================
mountsRoutes(app);


app.all("*", (req, res, next) => {
  next(new ApiError(`con't find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

// تعريف ال port الخاص بالسيرفر
const PORT = process.env.PORT || 5005;

// الاستماع الي ال port
const server = app.listen(PORT, () => {
  console.log(`server run to port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection ${err.name} || ${err.message}`);
  server.close(() => {
    console.log(`app close`);
    process.exit(1);
  });
});
