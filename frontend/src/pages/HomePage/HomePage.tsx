import {
  Container,
  Typography,
} from '@mui/material';

export default function SignIn() {
  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h2">Hello World!</Typography>
      <Typography variant="body1">To see this text, you should be signed in.</Typography>
    </Container>
  );
}
