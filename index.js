import express from 'express';
import { downloadAndUnzip } from './dataHandler';
import {parseExchangesFile, parseRatesFile} from "./parser";

const app = express();
const port = 8000;

app.listen(port);
console.log("server listening to port: ", port);
/////////////////////////////////////////////////////////////////////////

// Functions
// setInterval(downloadAndUnzip, 5000);
parseRatesFile();