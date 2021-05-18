const withSass = require('@zeit/next-sass');
const withFonts = require('nextjs-fonts');

const dotenv = require('dotenv')
const isDev = process.env.NODE_ENV === 'local';
console.log('-----------', isDev, '-----------');

if (isDev)  {
  dotenv.config({ path: '.local.env' })
}

if (!isDev)  {
  dotenv.config({path: `.${process.env.NODE_ENV}.env`})
}

function HACK_removeMinimizeOptionFromSassLoaders(config) {
  console.warn(
    'HACK: Removing `minimize` option from `sass-loader` entries in Webpack config',
  );
  config.module.rules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach(u => {
        if (u.loader === 'sass-loader' && u.options) {
          delete u.options.minimize;
        }
      });
    }
  });
}

module.exports = () => {

  const config = {
    productionBrowserSourceMaps: process.env.PRODUCTION_BROWSER_SOURCE_MAPS === 'true',
    COMPANY_ENV: (() => {
      if (isDev) {
        return withSass(withFonts({
          webpack(config) {
            HACK_removeMinimizeOptionFromSassLoaders(config);
            return config;
          },
        }));
      }
      return 'COMPANY_ENV:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    publicRuntimeConfig: (() => {
      const _publicConfig = {
        CLIENT_ENV: process.env.NODE_ENV,
        DNS: process.env.DNS,
        BASE_URL: process.env.BASE_URL,
        STATE: process.env.STATE,
        API_LOGIN: process.env.API_LOGIN,
        CLIENT_ID: process.env.CLIENT_ID,
        FCM: {
          apiKey: "AIzaSyCC9Fw-20uc_UVKhPcW_Phnac7kleGFqRo",
          authDomain: "test-fcm-652ab.firebaseapp.com",
          projectId: "test-fcm-652ab",
          storageBucket: "test-fcm-652ab.appspot.com",
          messagingSenderId: "961485436410",
          appId: "1:961485436410:web:896e1ede44652c04e2e043",
          measurementId: "G-S8E46696TF"
        }
      };
      return _publicConfig;
    })(),
    pageExtensions: ["page.tsx"],
  }

  return config
}
