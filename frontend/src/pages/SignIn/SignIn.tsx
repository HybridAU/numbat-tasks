import { Alert, Button, Container, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Form, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import token, { type SignInRequest } from "../../api/token";
import FormTextField from "../../components/form/FormTextField";
import { useAuthenticationsDispatch } from "../../providers/AuthenticationProvider.tsx";

export default function SignIn() {
  const authenticationsDispatch = useAuthenticationsDispatch();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, error } = useMutation({
    mutationFn: (data: SignInRequest) => token(data),
    onSuccess: (result) => {
      authenticationsDispatch({
        type: "SET_LOGGED_IN",
        payload: { accessToken: result.access, refreshToken: result.refresh },
      });
      navigate("/");
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h1">Sign In</Typography>
      {error && (
        <Alert severity="error">
          Error:
          {error.message}
        </Alert>
      )}
      <Form control={control}>
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
          onClick={handleSubmit((data: SignInRequest) => {
            mutate(data);
          })}
        >
          Sign In
        </Button>
      </Form>
    </Container>
  );
}
