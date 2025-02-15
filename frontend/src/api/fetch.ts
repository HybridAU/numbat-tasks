import { useAuthenticationsState } from "../providers/AuthenticationProvider.tsx";

export const fetchWithAuth = async (
  url: string,
  options: RequestInit,
): Promise<Response> => {
  const { accessToken } = useAuthenticationsState();
  // TODO actually check expiry / handle refresh.
  return await fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${accessToken}` },
  });
};
