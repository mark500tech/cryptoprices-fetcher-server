import {readFileSync, writeFileSync, createReadStream, createWriteStream} from 'fs';
import {set} from 'lodash';
import { decodeStream, encodeStream } from 'iconv-lite';
import path from 'path';
import {
  CRYPTOS_ID_ARRAY,
  CURRENCIES_OBJECT,
  CURRENCIES_PATH,
  EXCHANGES_PATH,
  ID_ADV_USD,
  RATES_PATH} from "../constants";

const handleFile = (fileData) => {
  return fileData.split('\n').map((line) => line.split(';'));
};

const splitFileToMatrix = (filePath) => {
  // Splitting file to array of lines
  let fileData = '';
  const decodingParser = decodeStream('win1251');
  const encodingParser = encodeStream('utf8');
  encodingParser.on('data', (chunk) => fileData += chunk.toString());
  return new Promise((resolve, reject) => {
    encodingParser.on('finish', () => resolve(handleFile(fileData)));
    createReadStream(path.join(__dirname, '..', filePath))
      .pipe(decodingParser)
      .pipe(encodingParser);
  })
};

const parseCurrenciesFile = () => {
  const fileArray = splitFileToMatrix(CURRENCIES_PATH);
  const currencies = {};

  fileArray.forEach((currency) => {
    set(currencies, currency[0], currency[2])
  });

  return currencies;
};

const parseExchangesFile = async () => {
  const fileArray = await splitFileToMatrix(EXCHANGES_PATH);
  const exchanges = {};

  fileArray.forEach((exchange) => {
    set(exchanges, exchange[0], exchange[1]);
  });

  return exchanges;
};

export const parseRatesFile = async () => {
  const exchanges = await parseExchangesFile();
  const fileArray = await splitFileToMatrix(RATES_PATH);
  const rates = [];
  let i = 0;

  fileArray.forEach((rate) => {
    // Sell relevant crypto for ADV_USD
    if ((CRYPTOS_ID_ARRAY.includes(rate[0]) && rate[1] === ID_ADV_USD) ||
    // Buy relevant crypto with ADV_USD
        (rate[0] === ID_ADV_USD && CRYPTOS_ID_ARRAY.includes(rate[1]))) {
      rates[i++] = {
        from: CURRENCIES_OBJECT[rate[0]],
        fromId: rate[0],
        to: CURRENCIES_OBJECT[rate[1]],
        toId: rate[1],
        exchange: exchanges[rate[2]],
        send: Number(rate[3]),
        receive: Number(rate[4]),
        reserve: Number(rate[5])
      }
    }
  });

  return rates;
};