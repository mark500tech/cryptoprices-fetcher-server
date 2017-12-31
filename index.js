import express from 'express';
import { createData, createDataForLoop } from './logic/dataHandler';

const app = express();
const port = 8000;

app.listen(port);
console.log("server listening to port: ", port);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
/////////////////////////////////////////////////////////////////////////
app.get('/data', (req, res) => {
  createData(res);
});

setInterval(createDataForLoop, 5000);