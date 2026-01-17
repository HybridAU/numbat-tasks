import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getConfig } from "../../api/config.ts";
import token, { type SignInRequest } from "../../api/token";
import FormTextField from "../../components/form/FormTextField";
import { useAuthenticationsDispatch } from "../../providers/AuthenticationProvider.tsx";

export default function SignUp() {
  const authenticationsDispatch = useAuthenticationsDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, error } = useMutation({
    mutationFn: (data: SignInRequest) => token(data),
    onSuccess: (result) => {
      authenticationsDispatch({
        type: "SET_LOGGED_IN",
        payload: { accessToken: result.access, refreshToken: result.refresh },
      });
      // Invalidate config, because now it may no longer be the initial signup
      queryClient.invalidateQueries({ queryKey: ["config"] });
      navigate("/");
    },
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ["config"],
    queryFn: () => getConfig(),
  });
  const signUpAvailable = config?.signup_enabled || config?.initial_setup;

  if (isLoading)
    return (
      <Stack
        height="400px"
        width="100%"
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress size="4rem" />
      </Stack>
    );

  if (!signUpAvailable)
    return (
      <Typography variant="h1">Signups are not currently available</Typography>
    );

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h1">Create a new account</Typography>
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
        <FormTextField
          control={control}
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
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
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}
