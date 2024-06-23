import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h2">Hello World!</Typography>
      <Typography variant="body1">To see this text, you should be signed in.</Typography>
      <Button
        sx={{ my: '2em' }}
        variant="contained"
        onClick={() => {
          signOut();
          navigate('/sign-in');
        }}
      >
        Sign out
      </Button>
    </Container>
  );
}
