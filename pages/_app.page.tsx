import './login/UI/login.sass';
import './users/UI/users.sass';
import '../components/table/table.sass';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
// import * as Sentry from '@sentry/browser';
import { ThemeProvider, NoSsr } from '@material-ui/core';
import '../styles/globals.css';
import '../styles/sass/index.sass';
// import { config } from '../helpers/get_config';
import { makeStore } from '../redux/store';
import theme from '../styles/theme/theme';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import Auth from '../components/auth';
import Layout from '@components/pages_layout/pages_layout';

// if (['production', 'dev'].includes(config.ENV)) {
//   Sentry.init({
//     environment: config.ENV,
//     dsn: config.DNS,
//     tracesSampleRate: 1.0,
//   });
// }

const withoutLayoutPaths = ['/login', '/login.html'];

function myApp({ Component, pageProps, store }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NoSsr>
          <Auth>
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              maxSnack={100}
            >
              <Layout withoutPaths={withoutLayoutPaths}>
                <Component {...pageProps} />
              </Layout>
            </SnackbarProvider>
          </Auth>
        </NoSsr>
      </ThemeProvider>
    </Provider>
  );
}

export default withRedux(makeStore)(myApp);
