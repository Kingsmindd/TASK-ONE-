export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
const base = import.meta.env.VITE_API_URL || "/api";
export async function request<T>(
  path: string,
  token?: string,
  method = "GET",
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(base + path, {
      method,
      signal,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error(
      "Cannot reach the server. Check your connection and make sure the backend is running.",
      { cause: error },
    );
  }
  const data = await response.json();
  if (!response.ok) {
    const details = data.errors
      ? Object.values(data.errors).flat().join(" ")
      : "";
    throw new ApiError(
      details || data.message || "Request failed",
      response.status,
    );
  }
  return data as T;
}
