import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FormTextField from '../../components/form/FormTextField';
import token, { SignInRequest } from '../../api/token';

// TODO
//  * Add base path as part of the URL
//  * Use zod
//  * Sign out button
//  * Make a call with auth
//  * Handle errors (e.g. 401)
export default function SignIn() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '', password: '',
    },
  });

  const submitLogin = async (data: SignInRequest) => {
    const result = await token(data);
    signIn({
      auth: {
        token: result.access,
      },
      refresh: result.refresh,
    });
    navigate('/');
  };
  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">Sign In</Typography>
      <Box>
        <FormTextField
          control={control}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <FormTextField
          control={control}
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
          onClick={handleSubmit(submitLogin)}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
}
