export type SignUpRequest = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
};

// User details, shared response by a bunch of endpoints
type UserDetails = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
};

const signup = async (request: SignUpRequest): Promise<UserDetails> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/accounts/user/signup/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: request.email,
        password: request.password,
        first_name: request.first_name,
        last_name: request.last_name,
      }),
    },
  );
  if (response.ok) {
    return (await response.json()) as UserDetails;
  }
  throw new Error(`${response.statusText}`);
};

export default signup;
