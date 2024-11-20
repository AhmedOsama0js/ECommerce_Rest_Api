// Frame work Node.js
const express = require("express");
// library used to manage and set variables in applications.
const dotenv = require("dotenv");
// library To record HTTP requests received by the server.
const morgen = require("morgan");
// library To reduce the size of data sent from the server to the client by compression
const compression = require("compression");
// library Protecting the server from attacks that rely on flooding it with requests, such as DDoS or Brute-force.
const { rateLimit } = require("express-rate-limit");
// library It is a tool to protect web applications from HTTP Parameter Pollution attacks.
const hpp = require("hpp");
// library To protect MongoDB databases from attacks based on malicious query injection (Injection Attacks).
const mongoSanitize = require("express-mongo-sanitize");
// library Used to enable Cross-Origin Resource Sharing
const cors = require("cors");

// Definition of the config file
dotenv.config({ path: "config.env" });

const path = require("path");

// Call another file in the project========================================================================================================
const connectDatabase = require("./Config/dbConfig");
const mountsRoutes = require("./Routes/index");
const ApiError = require("./utils/ApiError");
const globalError = require("./middleware/errorMiddleware");

//create app with express
const app = express();

app.use(cors());
app.options("*", cors());

app.use(compression());

// Contact Database
connectDatabase();

// middlewares========================================================================================================

// It is used to specify a maximum body size in requests received from the client in the application
app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// Run the mongoose library
if (process.env.NODE_MODE) {
  app.use(morgen("dev"));
  console.log(`node mode is ${process.env.NODE_MODE}`);
}

// Run the mongoSanitize library
app.use(mongoSanitize());

// Limit the volume of requests sent by one user in 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: " Too many requests, please try again after 15 minutes",
});
// Determine the root on which the function is performed
app.use("/api", limiter);

// Protect the application from HPP attacks by allowing only specified parameters
app.use(hpp({ whitelist: ["price", "sold", " quantity"] }));

//  routes
mountsRoutes(app);

// 400 error
app.all("*", (req, res, next) => {
  next(new ApiError(`con't find this route ${req.originalUrl}`, 400));
});

// Error Handling=====================================================================================================
app.use(globalError);

// Definition of the server's port
const PORT = process.env.PORT || 5005;

// Listening to the port
const server = app.listen(PORT, () => {
  console.log(`server run to port ${PORT}`);
});

// Dealing with unhandled promises (unhandled rejection),
// The error is logged and the server is safely shut down before the process is terminated.
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection ${err.name} || ${err.message}`);
  server.close(() => {
    console.log(`app close`);
    process.exit(1);
  });
});
