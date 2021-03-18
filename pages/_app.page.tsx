import './login/UI/login.sass';
import './users/UI/users.sass';
import '../components/table/table.sass';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import * as Sentry from '@sentry/browser';
import { ThemeProvider, NoSsr } from '@material-ui/core';
import '../styles/globals.css';
import '../styles/sass/index.sass';
import { config } from '../helpers/get_config';
import { makeStore } from '../redux/store';
import theme from '../styles/theme/theme';

if (['production', 'dev'].includes(config.ENV)) {
  Sentry.init({
    environment: config.ENV,
    dsn: config.DNS,
    tracesSampleRate: 1.0,
  });
}

function myApp({ Component, pageProps, store }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NoSsr>
          <Component {...pageProps} />
        </NoSsr>
      </ThemeProvider>
    </Provider>
  );
}

export default withRedux(makeStore)(myApp);
