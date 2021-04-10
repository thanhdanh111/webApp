import getConfig from 'next/config';

const { publicRuntimeConfig } : {publicRuntimeConfig: object} = getConfig();

export const config = {
  ENV: publicRuntimeConfig['CLIENT_ENV'],
  DNS: publicRuntimeConfig['DNS'],
  BASE_URL: publicRuntimeConfig['BASE_URL'],
  CLIENT_ID: publicRuntimeConfig['CLIENT_ID'],
  STATE: publicRuntimeConfig['STATE'],
  API_LOGIN: `${publicRuntimeConfig['API_LOGIN']}${publicRuntimeConfig['CLIENT_ID']}`,
  FCM: publicRuntimeConfig['FCM'],
};
