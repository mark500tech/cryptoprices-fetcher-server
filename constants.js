export const DOWNLOAD_DATA_URL = 'http://www.bestchange.ru/bm/info.zip';
export const DATA_FOLDER = './download';
export const DATA_PATH = `${DATA_FOLDER}/data.zip`;
export const CURRENCIES_PATH = `${DATA_FOLDER}/bm_cy.dat`;
export const EXCHANGES_PATH = `${DATA_FOLDER}/bm_exch.dat`;
export const RATES_PATH = `${DATA_FOLDER}/bm_rates.dat`;

// Currency IDs
export const ID_ETH = '139';
export const ID_LTC = '99';
export const ID_DASH = '140';
export const ID_ADV_USD = '88';
export const CRYPTOS_ID_ARRAY = [ID_ETH, ID_LTC, ID_DASH];
export const CURRENCIES_OBJECT = {
  [ID_ETH]: 'ETH',
  [ID_LTC]: 'LTC',
  [ID_DASH]: 'DASH',
  [ID_ADV_USD]: 'Advanced Cash $',
};