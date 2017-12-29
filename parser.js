import {readFileSync} from 'fs';
import {CURRENCIES_PATH} from "./constants";

export const splitFileToMatrix = (filePath) => {
  // Splitting file to array of lines
  const fileArray = readFileSync(filePath).toString().split('\n');
  // Splitting every line to array of data
  const fileMatrix = fileArray.map((line) => {
    return line.toString().split(';');
  });

  return fileMatrix;
};

export const parseCurrenciesFile = () => {
  const fileArray = splitFileToMatrix(CURRENCIES_PATH);
  const currencies = [];

  fileArray.forEach((currency, index) => {
    currencies[index] = {
      id: currency[0],
      title: currency[2]
    }
  });

  return currencies;
};