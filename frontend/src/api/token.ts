export type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  access: string;
  refresh: string;
};

const token = async (request: SignInRequest): Promise<SignInResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: request.email, password: request.password }),
  });
  if (response.ok) {
    return (await response.json()) as SignInResponse;
  }
  throw new Error(`${response.statusText}`);
};

export default token;
