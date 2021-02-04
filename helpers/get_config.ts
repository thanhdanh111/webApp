import getConfig from 'next/config';

const { publicRuntimeConfig } : {publicRuntimeConfig: object} = getConfig();

export const config = {
  API_HOST: publicRuntimeConfig['API_HOST'],
  ENV: publicRuntimeConfig['CLIENT_ENV'],
  DNS: publicRuntimeConfig['DNS'],
};
