const backendServer = import.meta.env.VITE_BACKEND_SERVER
const BASE_URL =  backendServer ?  backendServer : ''

export const client = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw error || new Error("Request failed");
  }

  return response.json();
};
