import path from 'path';

export const DOWNLOAD_DATA_URL = 'http://www.bestchange.ru/bm/info.zip';
export const DATA_FOLDER = path.join(__dirname, '..', 'download');
export const DATA_PATH = `${DATA_FOLDER}/data.zip`;
export const CURRENCIES_PATH = `${DATA_FOLDER}/bm_cy.dat`;
export const EXCHANGES_PATH = `${DATA_FOLDER}/bm_exch.dat`;
export const RATES_PATH = `${DATA_FOLDER}/bm_rates.dat`;
export const MIN_USD_EXHANGE_SUM = 100;
export const MIN_USD_PROFIT = 10;
export const TELEGRAM_TOKEN = '470037127:AAGQcTRM_gLFzJCKylkXC-zp-LFhgWVPSHY';
export const CHAT_ID = '273626142';

// Currency IDs
export const ID_ADV_USD = '88';
export const ID_LTC = '99';
export const ID_ETH = '139';
export const ID_DASH = '140';
export const ID_XMR = '149';
export const ID_ETC = '160';
export const ID_XRP = '161';
export const ID_ZEC = '162';
export const ID_BCH = '172';
export const CRYPTOS_ID_ARRAY = [
  ID_ETH, ID_LTC, ID_DASH, ID_ZEC, ID_BCH
];
export const CURRENCIES_OBJECT = {
  [ID_ADV_USD]: 'Advanced Cash $',
  [ID_LTC]: 'Litecoin',
  [ID_ETH]: 'Etherium',
  [ID_DASH]: 'Dash',
  [ID_ZEC]: 'ZCash',
  [ID_BCH]: 'BitcoinCash',
};