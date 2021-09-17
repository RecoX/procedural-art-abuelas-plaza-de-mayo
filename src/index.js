"use strict";

const app = require("./app");
const port = app.get("port");

// Server starts to listen for requests
app.listen(port, () => {
  console.log(`Abuelas plaza de mayo API running on port ${port}\nStarted at: ${new Date()}`);
});
