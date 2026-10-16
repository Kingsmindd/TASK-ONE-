import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      });

      onLogin(data.token);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="mb-6 text-3xl font-semibold">
        Welcome back
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-stone-400 p-3"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            minLength={1}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-stone-400 p-3"
          />
        </div>

        {error && (
          <p role="alert" className="text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-purple-600 p-3 text-white disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Log in"}
        </button>
      </form>
      <p className="mt-6">
        New here?{" "}
        <Link to="/register" className="text-purple-700 underline">
          Create an account
        </Link>
      </p>
    </section>
  );
}
