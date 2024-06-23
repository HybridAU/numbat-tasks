import './App.css';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from 'react-auth-kit';
import router from './router';
import theme from './theme/theme';
import store from './auth';

function App() {
  const queryClient = new QueryClient();
  return (
    <AuthProvider store={store}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
