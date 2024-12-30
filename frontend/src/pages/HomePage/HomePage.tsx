import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
} from '@tanstack/react-query';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import getLists from '../../api/getLists';

export default function HomePage() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const authHeader = useAuthHeader();

  const { data } = useQuery({
    queryKey: ['Lists'],
    queryFn: () => getLists(authHeader),
    enabled: !!authHeader,
  });

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h2">Hello World!</Typography>
      <Typography variant="body1">Here is a list of your to do lists</Typography>
      {data && <ul>{data?.map((todo) => <li key={todo.id}>{todo.name}</li>)}</ul>}
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
