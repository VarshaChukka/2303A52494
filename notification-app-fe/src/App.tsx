import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { NotificationsPage } from './pages/NotificationsPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d4ed8',
    },
    background: {
      default: '#eef3fb',
    },
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'].join(','),
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationsPage />
    </ThemeProvider>
  );
}