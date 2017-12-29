import {readFileSync} from 'fs';
import {set} from 'lodash';
import {
  CRYPTOS_ID_ARRAY,
  CURRENCIES_OBJECT,
  CURRENCIES_PATH,
  EXCHANGES_PATH,
  ID_ADV_USD,
  RATES_PATH} from "../constants";

const splitFileToMatrix = (filePath) => {
  // Splitting file to array of lines
  const fileArray = readFileSync(filePath).toString().split('\n');
  // Splitting every line to array of data
  const fileMatrix = fileArray.map((line) => {
    return line.toString().split(';');
  });

  return fileMatrix;
};

const parseCurrenciesFile = () => {
  const fileArray = splitFileToMatrix(CURRENCIES_PATH);
  const currencies = {};

  fileArray.forEach((currency) => {
    set(currencies, currency[0], currency[2])
  });

  return currencies;
};

const parseExchangesFile = () => {
  const fileArray = splitFileToMatrix(EXCHANGES_PATH);
  const exchanges = {};

  fileArray.forEach((exchange) => {
    set(exchanges, exchange[0], exchange[1]);
  });

  return exchanges;
};

export const parseRatesFile = () => {
  const exchanges = parseExchangesFile();
  const fileArray = splitFileToMatrix(RATES_PATH);
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