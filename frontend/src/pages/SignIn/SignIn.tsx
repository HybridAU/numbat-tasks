import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';

export default function SignIn() {
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
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
}
