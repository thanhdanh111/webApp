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
        DNS: 'https://292b38933d2a4e8e9a523348e618adbe@o374091.ingest.sentry.io/5622776',
        // BASE_URL: 'https://d71b1d31f5b8.ngrok.io/local',
        BASE_URL: 'https://7val2au24i.execute-api.ap-southeast-1.amazonaws.com/dev',
        STATE: 'http://localhost:5000',
        API_LOGIN: 'https://accounts.google.com/o/oauth2/v2/auth?scope=profile&access_type=offline&include_granted_scopes=true&response_type=code&client_id=',
        CLIENT_ID: '440910022326-ntth1t95ht7q6kvc8qj0bmeq81foj2ob.apps.googleusercontent.com',
      };
      if (isDev) {
        return _publicConfig;
      }

      _publicConfig['STATE'] = 'https://staging-app.sntsolutions.io';
      return _publicConfig;
    })(),
    pageExtensions: ["page.tsx"],
  }

  return config
}
