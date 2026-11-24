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
  // Allow the hosted API time to start; local requests retain a shorter limit.
  const hostedOnRender = new URL(base, window.location.origin).hostname.endsWith(".onrender.com");
  const timeout = AbortSignal.timeout(hostedOnRender ? 65_000 : 20_000);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  let response: Response;
  try {
    response = await fetch(base + path, {
      method,
      signal: requestSignal,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timeout.aborted) throw new Error("The server is taking too long. Please try again.", { cause: error });
    throw new Error(
      "Cannot reach the server. Check your connection and make sure the backend is running.",
      { cause: error },
    );
  }
  const data = await response.json().catch(() => {
    throw new ApiError("The server returned an unexpected response. Please try again.", response.status);
  });
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
