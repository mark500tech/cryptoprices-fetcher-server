import {get} from 'http';
import {createWriteStream} from 'fs';
import AdmZip from 'adm-zip';
import {sortBy} from 'lodash';

import {DATA_FOLDER, DATA_PATH, DOWNLOAD_DATA_URL} from "../constants";
import {parseRatesFile} from "./parser";

export const createData = (resObject) => {
  // Downloading
  const file = createWriteStream(DATA_PATH);
  const request = get(DOWNLOAD_DATA_URL, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      console.log(new Date() + ' Data file downloaded successfully!');
      // Unzipping
      const zip = AdmZip(DATA_PATH);
      zip.extractAllTo(DATA_FOLDER, true);
      // Parsing and sending ready data array
      resObject.send(parseRatesFile());

      file.close();  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    console.log('Error while downloading data: ' + err.message);
  });
};

// Returns 2 sorted arrays - send and receive according to cryptocurrency id
export const getSortedSendReceiveArrays = (dataArray, cryptoId) => {
  let send = [];
  let receive = [];

  dataArray.forEach((record => {
      if (record.fromId === cryptoId) {
        send.push(record);
      }

      if (record.toId === cryptoId) {
        receive.push(record);
      }
    })
  );

  send = sortBy(send, (item) => item.receive).reverse();
  receive = sortBy(receive, (item) => item.send);

  return {send, receive};
};