"use strict";

const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.set("port", 3100);
app.set("trust proxy", 1);

// Middlewares
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Defiene ALL routes here!
app.use(require("./routes"));


module.exports = app;
