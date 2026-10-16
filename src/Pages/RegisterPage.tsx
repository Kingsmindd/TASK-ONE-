import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";

interface RegisterPageProps {
  onLogin: (token: string) => void;
}

export default function RegisterPage({ onLogin }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser({ name: name.trim(), email: email.trim(), password });
      const data = await loginUser({
        email: email.trim(),
        password,
      });

      onLogin(data.token);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="mb-6 text-3xl font-semibold">
        Create your account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="register-name" className="mb-2 block">Name</label>
          <input
            id="register-name"
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-stone-400 p-3"
          />
        </div>
        <div>
          <label htmlFor="register-email" className="mb-2 block">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-stone-400 p-3"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="mb-2 block">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
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
          {loading ? "Please wait..." : "Create account"}
        </button>
      </form>
      <p className="mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-purple-700 underline">
          Log in
        </Link>
      </p>
    </section>
  );
}
