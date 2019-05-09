import axios from 'axios';
import {
  GET_PRODUCTS_BY_SELL,
  GET_PRODUCTS_BY_ARRIVAL,
  GET_BRANDS,
  GET_WOODS
} from './types';

import { PRODUCT_SERVER } from '../components/utils/misc';
import { EXDEV } from 'constants';

export function getProductsBySell() {
  // ?sortBy=sold&order=desc&limit=4
  const request = axios.get(`${PRODUCT_SERVER}/articles?sortBy=sold&order=desc&limit=4`)
  .then(response => response.data);

  return {
    type: GET_PRODUCTS_BY_SELL,
    payload: request
  }
}

export function getProductsByArrival() {
  // ?sortBy=arrival&order=desc&limit=4
  const request = axios.get(`${PRODUCT_SERVER}/articles?sortBy=createdAt&order=desc&limit=4`)
  .then(response => response.data);

  return {
    type: GET_PRODUCTS_BY_ARRIVAL,
    payload: request
  }
}

/////////////////////////////////////
//          CATEGORIES             //
/////////////////////////////////////

export const getBrands = () => {
  const request = axios.get(`${PRODUCT_SERVER}/brands`)
  .then(res => res.data);

  return {
    type: GET_BRANDS,
    payload: request
  }
}

export const getWoods = () => {
  const request = axios.get(`${PRODUCT_SERVER}/woods`)
  .then(res => res.data);

  return {
    type: GET_WOODS,
    payload: request
  }
}