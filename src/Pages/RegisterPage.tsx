import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiUserPlus, FiCheck } from "react-icons/fi";
import PasswordInput from "../componets/PasswordInput";
import { loginUser, registerUser } from "../api/auth";

interface RegisterPageProps {
  onLogin: (token: string) => void;
}

export default function RegisterPage({ onLogin }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;
    if (password !== confirmPassword) { setError("Your passwords do not match."); return; }
    if (new TextEncoder().encode(password).length > 72) { setError("Password must not exceed 72 bytes. Try a shorter password."); return; }
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
    <section className="mx-auto w-full max-w-lg py-2 sm:py-6">
      <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-950/5">
      <header className="border-b border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 sm:p-8">
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl border border-purple-200 bg-white text-xl text-purple-700"><FiUserPlus aria-hidden="true" /></span>
      <h1 className="text-3xl font-bold tracking-tight text-purple-950">
        Create your account
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-500">A clearer day starts here. Create your workspace and make room for what matters.</p>
      </header>
      <div className="p-6 sm:p-8">

      <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-5">
        <fieldset disabled={loading} className="space-y-5">
        <div>
          <label htmlFor="register-name" className="block text-sm font-semibold text-stone-700">Name</label>
          <input
            id="register-name"
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 transition-colors placeholder:text-stone-400 focus:border-purple-600 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="register-email" className="block text-sm font-semibold text-stone-700">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 transition-colors placeholder:text-stone-400 focus:border-purple-600 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-semibold text-stone-700">
            Password
          </label>
          <PasswordInput id="register-password" name="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-help" />
          <p id="password-help" className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">{password.length >= 8 ? <FiCheck className="text-emerald-600" aria-hidden="true" /> : null}Use at least 8 characters. Maximum 72 bytes.</p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-stone-700">Confirm password</label>
          <PasswordInput id="confirm-password" name="confirmPassword" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} aria-describedby={confirmPassword ? "confirm-help" : undefined} />
          {confirmPassword && <p id="confirm-help" className={"mt-2 text-xs " + (password === confirmPassword ? "text-emerald-700" : "text-stone-500")}>{password === confirmPassword ? "Passwords match" : "Enter the same password again."}</p>}
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
          {loading ? "Creating your account…" : "Create account"} {!loading && <FiArrowRight aria-hidden="true" />}
        </button>
        </fieldset>
      </form>
      <p className="mt-6 border-t border-stone-200 pt-5 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-4 py-3 font-semibold text-purple-700 transition-colors hover:border-purple-400 hover:bg-purple-50">
          Log in
        </Link>
      </p>
      </div>
      </div>
      <Link to="/" className="mx-auto mt-5 flex min-h-11 w-fit items-center gap-2 rounded-lg px-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"><FiArrowLeft aria-hidden="true" /> Back to home</Link>
    </section>
  );
}
