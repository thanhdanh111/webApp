import './login/UI/login.sass'
import './users/UI/users.sass'
import '../components/table/table.sass'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import * as Sentry from '@sentry/browser'
import { ThemeProvider, NoSsr, Button } from '@material-ui/core'
import '../styles/globals.css'
import '../styles/sass/index.sass'
import { config } from '../helpers/get_config'
import { makeStore } from '../redux/store'
import theme from '../styles/theme/theme'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import Auth from '../components/auth/auth'
import Layout from '@components/pages_layout/pages_layout'
import { LocalizationProvider } from '@material-ui/pickers'
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns'
import { ModalTaskDetail } from './tasks/UI/modal_task_detail'

if (['production'].includes(config.ENV)) {
  Sentry.init({
    environment: config.ENV,
    dsn: config.DNS,
    tracesSampleRate: 1.0,
  })
}

const getPaths = (paths: string[]) => {
  const newPaths: string[] = []

  paths.map((path) => {
    if (path === '/') {
      newPaths.push(path)

      return
    }
    newPaths.push(path)
    newPaths.push(`${path}.html`)
  })

  return newPaths
}

const publicPages = getPaths([
  '/',
  '/login',
  '/access_denied',
  '/home',
  '/account',
])
const withoutLayoutPaths = getPaths([
  '/login',
  '/access_denied',
])
const notistackRef = React.createRef<SnackbarProvider>()
const onClickDismiss = (key) => {
  notistackRef?.current?.closeSnackbar(key)
}
function myApp({ Component, pageProps, store }) {

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={DateFnsUtils}>
        <NoSsr>
          <SnackbarProvider
            ref={notistackRef}
            action={(key) => (
                <Button onClick={() => onClickDismiss(key)}>
                    X
                </Button>
            )}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            maxSnack={100}
          >
            <Auth publicPages={publicPages} >
              <Layout withoutPaths={withoutLayoutPaths}>
                <Component {...pageProps} />
                <ModalTaskDetail/>
              </Layout>
            </Auth>
          </SnackbarProvider>
        </NoSsr>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default withRedux(makeStore)(myApp)
