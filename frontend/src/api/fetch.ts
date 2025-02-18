export const fetchWithAuth = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  // TODO actually check expiry / handle refresh.
  const accessToken = localStorage.getItem("accessToken");
  // const refreshToken = localStorage.getItem("refreshToken");
  return await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
