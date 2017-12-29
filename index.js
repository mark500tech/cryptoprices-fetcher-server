import express from 'express';
import { createData } from './logic/dataHandler';

const app = express();
const port = 8000;

app.listen(port);
console.log("server listening to port: ", port);
/////////////////////////////////////////////////////////////////////////
app.get('/data', (req, res) => {
  createData(res);
});