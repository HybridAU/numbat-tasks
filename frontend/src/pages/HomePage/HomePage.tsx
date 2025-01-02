import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Form, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addTask, type addTaskRequest, getTasks } from "../../api/tasks";
import BottomAppBar from "../../components/BottomAppBar";
import Task from "../../components/Task";
import FormTextField from "../../components/form/FormTextField";
import { useListsState } from "../../providers/ListsProvider";

export default function HomePage() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const queryClient = useQueryClient();
  const { listsLoaded, currentList } = useListsState();
  const { control, handleSubmit } = useForm({ defaultValues: { task: "" } });
  const { mutate } = useMutation({
    mutationFn: (data: addTaskRequest) => addTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks", currentList?.id],
    queryFn: () => getTasks({ authHeader, listId: currentList.id }),
    enabled: !!authHeader && listsLoaded,
  });

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="body1">
        Here is a list of your to do lists
      </Typography>
      {tasks ? (
        <div>
          {tasks?.map((task) => (
            <Task key={task.id} {...task} />
          ))}
        </div>
      ) : (
        <CircularProgress />
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
            mutate({
              text: data.task,
              listId: currentList?.id,
              authHeader: authHeader,
            });
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
      <BottomAppBar />
    </Container>
  );
}
