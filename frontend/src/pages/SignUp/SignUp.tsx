import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getConfig } from "../../api/config.ts";
import signup, { type SignUpRequest } from "../../api/user.ts";
import FormTextField from "../../components/form/FormTextField";

export default function SignUp() {
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
    mutationFn: (data: SignUpRequest) => signup(data),
    onSuccess: (_result) => {
      // Invalidate config, because now it may no longer be the initial signup, and
      // we don't want to get looped back to the signup screen after we navigate to sign in
      queryClient.invalidateQueries({ queryKey: ["config"] }).then(() => {
        navigate("/sign-in");
      });
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit((data: SignUpRequest) => {
            mutate(data);
          })}
        >
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}
