import { Button, Container, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import getLists from "../../api/getLists";
import { addTask, type addTaskRequest, getTasks } from "../../api/tasks";
import type { SignInRequest } from "../../api/token.ts";
import FormTextField from "../../components/form/FormTextField.tsx";

export default function HomePage() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const queryClient = useQueryClient();
  // TODO just hard coded for now...
  const [listId, _setListId] = useState(1);
  const { control, handleSubmit } = useForm({ defaultValues: { task: "" } });
  const { mutate, error } = useMutation({
    mutationFn: (data: addTaskRequest) => addTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });

  const { data: _lists } = useQuery({
    queryKey: ["Lists"],
    queryFn: () => getLists(authHeader),
    enabled: !!authHeader,
  });
  const { data: tasks } = useQuery({
    queryKey: ["tasks", listId],
    queryFn: () => getTasks({ authHeader, listId: listId }),
    enabled: !!authHeader,
  });

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="body1">
        Here is a list of your to do lists
      </Typography>
      {tasks && (
        <ul>
          {tasks?.map((task) => (
            <li key={task.id}>{task.text}</li>
          ))}
        </ul>
      )}
      <Form control={control}>
        <FormTextField
          control={control}
          label="task"
          variant="outlined"
          id="task"
          name="task"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit((data) => {
            mutate({ ...data, listId: 1, authHeader: authHeader });
          })}
        >
          Add task
        </Button>
      </Form>

      <Button
        sx={{ my: "2em" }}
        variant="contained"
        onClick={() => {
          signOut();
          navigate("/sign-in");
        }}
      >
        Sign out
      </Button>
    </Container>
  );
}
