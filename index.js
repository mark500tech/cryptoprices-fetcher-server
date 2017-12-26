const express = require('express');
const constants = require('./constants');
const dataHandler = require('./dataHandler');

const app = express();
const port = 8000;

app.listen(port);
console.log("server listening to port: ", port);
/////////////////////////////////////////////////////////////////////////

// Functions
setInterval(dataHandler.downloadAndUnzip, 5000);
