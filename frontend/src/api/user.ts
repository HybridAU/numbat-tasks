export type SignUpRequest = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
};

// User details response, shared by a bunch of endpoints
type UserResponse = {
  access: string;
  refresh: string;
};

// TODO this is broken, just commiting where I'm up to
const token = async (request: SignInRequest): Promise<SignInResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/token/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: request.email,
        password: request.password,
      }),
    },
  );
  if (response.ok) {
    return (await response.json()) as SignInResponse;
  }
  throw new Error(`${response.statusText}`);
};

export default token;
