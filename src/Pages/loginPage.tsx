import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiLock } from "react-icons/fi";
import PasswordInput from "../componets/PasswordInput";
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

    if (loading) return;
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
    <section className="mx-auto w-full max-w-lg py-2 sm:py-6">
      <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-950/5">
      <header className="border-b border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 sm:p-8">
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl border border-purple-200 bg-white text-xl text-purple-700"><FiLock aria-hidden="true" /></span>
      <h1 className="text-3xl font-bold tracking-tight text-purple-950">
        Welcome back
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-500">Pick up where you left off. Your tasks and priorities are waiting.</p>
      </header>
      <div className="p-6 sm:p-8">

      <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-5">
        <fieldset disabled={loading} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-semibold text-stone-700">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 transition-colors placeholder:text-stone-400 focus:border-purple-600 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-semibold text-stone-700">
            Password
          </label>
          <PasswordInput id="login-password" name="password" autoComplete="current-password" minLength={1} required value={password} onChange={(event) => setPassword(event.target.value)}  />
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"} {!loading && <FiArrowRight aria-hidden="true" />}
        </button>
        </fieldset>
      </form>
      <p className="mt-6 border-t border-stone-200 pt-5 text-center text-sm text-stone-500">
        New here?{" "}
        <Link to="/register" className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-4 py-3 font-semibold text-purple-700 transition-colors hover:border-purple-400 hover:bg-purple-50">
          Create an account
        </Link>
      </p>
      </div>
      </div>
      <Link to="/" className="mx-auto mt-5 flex min-h-11 w-fit items-center gap-2 rounded-lg px-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"><FiArrowLeft aria-hidden="true" /> Back to home</Link>
    </section>
  );
}
