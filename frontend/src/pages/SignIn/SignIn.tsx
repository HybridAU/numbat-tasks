import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom';

// TODO
//  * Use API library
//  * Add base path as part of the URL
//  * get the actual input
//  * Use react-hook-forms
//  * Use zod
//  * Add refresh
//  * Sign out button
//  * Make a call with auth.
export default function SignIn() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const submitLogin = async () => {
    const response = await fetch('/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    });
    if (response.ok) {
      const result = await response.json();
      signIn({
        auth: {
          token: result.access,
        },
        // refresh: result.refresh,
      });
      navigate('/');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">Sign In</Typography>
      <Box>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={submitLogin}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
}
