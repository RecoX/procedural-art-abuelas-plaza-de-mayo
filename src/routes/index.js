"use strict";

const express = require("express");
const router = express.Router();

// Routes
// warning: `auth` route is child of the `accounts` route

router.use("/nftmarket", require("./nftmarket"));

module.exports = router;
