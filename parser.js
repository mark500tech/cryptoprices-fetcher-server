import {readFileSync} from 'fs';
import {set} from 'lodash';
import {CURRENCIES_PATH, EXCHANGES_PATH, RATES_PATH} from "./constants";

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
  const currencies = parseCurrenciesFile();
  const exchanges = parseExchangesFile();
  const fileArray = splitFileToMatrix(RATES_PATH);
  const rates = [];

  fileArray.forEach((rate, index) => {
    rates[index] = {
      from: currencies[rate[0]],
      to: currencies[rate[1]],
      exchange: exchanges[rate[2]],
      send: Number(rate[3]),
      receive: Number(rate[4]),
      reserve: Number(rate[5])
    }
  });

  return rates;
};