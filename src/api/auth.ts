import { request } from "./http";
interface LoginInput {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string };
}
export const loginUser = (input: LoginInput) =>
  request<LoginResponse>("/auth/login", undefined, "POST", input);
export const registerUser = (input: LoginInput & { name: string }) =>
  request("/auth/register", undefined, "POST", input);
