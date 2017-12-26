const http = require('http');
const fs = require('fs');
const AdmZip = require('adm-zip');
const constants = require('./constants');

module.exports = Object.freeze({
  downloadAndUnzip: function (cb) {
      const file = fs.createWriteStream(constants.DATA_PATH);
      const request = http.get(constants.DOWNLOAD_DATA_URL, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          console.log(new Date() + ' Data file downloaded successfully!');

          const zip = AdmZip(constants.DATA_PATH);
          zip.extractAllTo(constants.DATA_FOLDER, true);
          file.close(cb);  // close() is async, call cb after close completes.
        });
      }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
      });
    }
});