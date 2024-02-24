import './App.css';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import router from './router';
import theme from './theme/theme';

function App() {
  const store = createStore({
    authName: 'token',
    authType: 'localstorage',
  });
  return (
    <AuthProvider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
