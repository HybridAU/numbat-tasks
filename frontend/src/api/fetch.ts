import dayjs from "dayjs";
import { type JwtPayload, jwtDecode } from "jwt-decode";

export const fetchWithAuth = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  let accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    window.location.href = "/sign-in";
    throw new Error("No accessToken found");
  }
  const decoded = jwtDecode<JwtPayload>(accessToken);
  // Refresh the accessToken 3 minutes before it expires, to allow for time drift between the client and server.
  const expiryDate = dayjs.unix(decoded.exp || 0).subtract(3, "minutes");
  const now = dayjs();

  if (now >= expiryDate) {
    accessToken = await handleRefresh();
  }

  return await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const handleRefresh = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    window.location.href = "/sign-in";
    throw new Error("No refreshToken found");
  }
  const decoded = jwtDecode<JwtPayload>(refreshToken);
  const expiryDate = dayjs.unix(decoded.exp || 0).subtract(3, "minutes");
  const now = dayjs();

  if (now >= expiryDate) {
    window.location.href = "/sign-in";
    throw new Error("Refresh token has expired must sign in again");
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    },
  );
  const json = await response.json();
  const newAccessToken = json.access;
  localStorage.setItem("accessToken", newAccessToken);
  return newAccessToken;
};
