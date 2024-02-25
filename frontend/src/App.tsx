import './App.css';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import AuthProvider from 'react-auth-kit';
import router from './router';
import theme from './theme/theme';
import store from './auth';

function App() {
  return (
    <AuthProvider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
