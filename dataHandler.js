import {get} from 'http';
import {createWriteStream} from 'fs';
import AdmZip from 'adm-zip';

import {DATA_FOLDER, DATA_PATH, DOWNLOAD_DATA_URL} from "./constants";

export const downloadAndUnzip = (cb) => {
  const file = createWriteStream(DATA_PATH);
  const request = get(DOWNLOAD_DATA_URL, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      console.log(new Date() + ' Data file downloaded successfully!');

      const zip = AdmZip(DATA_PATH);
      zip.extractAllTo(DATA_FOLDER, true);
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};