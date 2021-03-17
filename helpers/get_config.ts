import getConfig from 'next/config';

const { publicRuntimeConfig } : {publicRuntimeConfig: object} = getConfig();

export const config = {
  API_HOST: publicRuntimeConfig['API_HOST'],
  ENV: publicRuntimeConfig['CLIENT_ENV'],
  DNS: publicRuntimeConfig['DNS'],
  LOCAL_HOST: publicRuntimeConfig['LOCAL_HOST'],
  CLIENT_ID: '440910022326-ntth1t95ht7q6kvc8qj0bmeq81foj2ob.apps.googleusercontent.com',
  STATE: publicRuntimeConfig['STATE'],
};
