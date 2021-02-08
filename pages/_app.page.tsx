import '../styles/globals.css';
import '../styles/sass/index.sass';
import './login/UI/login.sass';
import { makeStore } from '../redux/store';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import * as Sentry from '@sentry/browser';
import { config } from '../helpers/get_config';

if (['production', 'dev'].includes(config.ENV)) {
  Sentry.init({
    environment: config.ENV,
    dsn: config.DNS,
    tracesSampleRate: 1.0,
  });
}

function myApp({ Component, pageProps, store }) {
  return (
    < Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default withRedux(makeStore)(myApp);
