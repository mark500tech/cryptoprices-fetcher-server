import express from 'express';
import * as constants from './constants';
import { downloadAndUnzip } from './dataHandler';

const app = express();
const port = 8000;

app.listen(port);
console.log("server listening to port: ", port);
/////////////////////////////////////////////////////////////////////////

// Functions
setInterval(downloadAndUnzip, 5000);
