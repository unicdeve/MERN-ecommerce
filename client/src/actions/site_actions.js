import axios from 'axios';
import { GET_SITE_DATA } from './types';

import { SITE_SERVER } from '../components/utils/misc';

export const getSiteData = () => {
  const request = axios.get(`${SITE_SERVER}/site_data`)
  .then(res => res.data);

  return {
    type: GET_SITE_DATA,
    payload: request
  }
}