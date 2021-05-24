const withSass = require('@zeit/next-sass');
const withFonts = require('nextjs-fonts');

const dotenv = require('dotenv')
const isDev = process.env.NODE_ENV === 'local';
console.log('-----------', isDev, '-----------');

dotenv.config({ path: `.${process.env.NODE_ENV}.env` })

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
          apiKey: process.env.FCM_apiKey,
          authDomain: process.env.FCM_authDomain,
          projectId: process.env.FCM_projectId,
          storageBucket: process.env.FCM_storageBucket,
          messagingSenderId: process.env.FCM_messagingSenderId,
          appId: process.env.FCM_appId,
          measurementId: process.env.FCM_measurementId,
          databaseURL: process.env.FCM_databaseURL
        }
      };
      return _publicConfig;
    })(),
    pageExtensions: ["page.tsx"],
  }

  return config
}
