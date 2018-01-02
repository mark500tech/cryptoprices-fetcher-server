import {get} from 'http';
import {createWriteStream, unlink} from 'fs';
import AdmZip from 'adm-zip';
import {sortBy} from 'lodash';

import {parseRatesFile} from "./parser";

import {
  DATA_FOLDER,
  DATA_PATH,
  DOWNLOAD_DATA_URL,
  ID_ADV_USD,
  MIN_USD_EXHANGE_SUM,
  CRYPTOS_ID_ARRAY
} from "../constants";

export const createData = (resObject) => {
  // Downloading
  const file = createWriteStream(DATA_PATH);
  const request = get(DOWNLOAD_DATA_URL, function (response) {
    response.pipe(file);
    file.on('finish', async function () {
      console.log(new Date() + ' Data file downloaded successfully!');
        // Unzipping
        const zip = AdmZip(DATA_PATH);
        zip.extractAllTo(DATA_FOLDER, true);
        // Parsing file to data array
        const dataArray = await parseRatesFile();
        // Sorting and building pairs
        const pairsDataArray = buildExchangePairs(dataArray);
      // Sending pairs to client
      resObject.send(pairsDataArray);

      file.close();  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    unlink(DATA_PATH); // Delete the file async. (But we don't check the result)
    console.log('Error while downloading data: ' + err.message);
  });
};

export const createDataForLoop = () => {
  // Downloading
  const file = createWriteStream(DATA_PATH);
  const request = get(DOWNLOAD_DATA_URL, function (response) {
    response.pipe(file);
    file.on('finish', async function () {
      // Unzipping
      const zip = AdmZip(DATA_PATH);
      zip.extractAllTo(DATA_FOLDER, true);
      // Parsing file to data array
      const dataArray = await parseRatesFile();
      // Sorting and building pairs
      const pairsDataArray = buildExchangePairs(dataArray);

      file.close();  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    unlink(DATA_PATH); // Delete the file async. (But we don't check the result)
    console.log('Error while downloading data: ' + err.message);
  });
};

// Returns 2 sorted arrays - send and receive according to cryptocurrency id
const getSortedSendReceiveArrays = (dataArray, cryptoId) => {
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

  if (!send.length) {
    console.log("Send array is empty for currency ID: ", cryptoId);
  } else if (!receive.length) {
    console.log("Receive array is empty for currency ID: ", cryptoId);
  }

  return {send, receive};
};

// Returns first item from sorted array that has reserve > than wanted
// wanted minimum for operation
const getFirstItemWithNeededReserve = (exchangeItems) => {
  let itemWithReserve = null;

  exchangeItems.some((item) => {
    // If we sell crypto we need reserve of ADV_USD
    if (item.toId === ID_ADV_USD) {
      if (item.reserve >= MIN_USD_EXHANGE_SUM) {
        itemWithReserve = item;
        return true;
      }
      // If we buy crypto we need reserve of crypto
    } else {
      if (item.reserve * item.send > MIN_USD_EXHANGE_SUM) {
        itemWithReserve = item;
        return true;
      }
    }
  });

  return itemWithReserve;
};

// Builds final data of pairs to exchange
export const buildExchangePairs = (dataArray) => {
  let pairs = [];

  CRYPTOS_ID_ARRAY.forEach((cryptoId) => {
    const arraysObject = getSortedSendReceiveArrays(dataArray, cryptoId);
    // First step is buy crypto with ADV_USD
    const firstStep = getFirstItemWithNeededReserve(arraysObject.receive);
    // Second step is sell crypto for ADV_USD
    const secondStep = getFirstItemWithNeededReserve(arraysObject.send);
    // Difference in percents after buying crypto and selling
    const difference = parseFloat(((secondStep.receive - firstStep.send) / firstStep.send * 100).toFixed(2));

    if (difference > 0) {
      console.log(`Exchange found!
      Buy: ${firstStep.to} price: ${firstStep.send} exchange: ${firstStep.exchange}
      Sell: ${secondStep.from} price: ${secondStep.receive} exchange: ${secondStep.exchange}`);
    }

    pairs.push({firstStep, secondStep, difference});
  });

  pairs = sortBy(pairs, (pair) => pair.difference).reverse();

  return pairs;
};
