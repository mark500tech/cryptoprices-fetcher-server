const express = require('express');
const fs = require('fs');
const app = express();
const port = 8000;

// Constants
// URLs
const URL_ADV_ETH = 'https://www.bestchange.ru/advanced-cash-to-ethereum.html';
const URL_ETH_ADV = 'https://www.bestchange.ru/ethereum-to-advanced-cash.html';

// Classes
const USD_PRICE_CLASS = '.fs';

app.listen(port);
console.log("server listening to port: ", port);
/////////////////////////////////////////////////////////////////////////

// Functions
function fetchPage(url) {
  request(url, function (err, response, body) {
    if (err) {
      console.log(Date.now() + ' Error while fetching the page')
      return;
    }

    const $ = cheerio.load(body);
    const parseResult = $('.fs').text();
    console.log('parseResult', parseResult);
  });
}
