import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#637381',
    },
    secondary: {
      main: '#00AB55',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgb(33, 43, 54)',
      secondary: '#637381',
    },
    action: {
      selected: 'rgb(33, 43, 54)',
      selectedOpacity: 1,
      focus: '#00AB55',
    },
  },
});

export default theme;
