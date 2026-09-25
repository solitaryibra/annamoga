"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

type Mode = "login" | "signup" | "forgot";

export default function AuthForm({ mode }: { mode: Mode }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/account";
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
            emailRedirectTo: window.location.origin + "/account",
          },
        });
        if (error) throw error;

        if (data.session) {
          await supabase.from("profiles").upsert(
            {
              user_id: data.user?.id,
              first_name: firstName || null,
              last_name: lastName || null,
            },
            { onConflict: "user_id" }
          );
          window.location.href = "/account";
          return;
        }

        setMessage("Account created. Check your email to confirm your address, then sign in.");
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/account",
        });
        if (error) throw error;
        setMessage("Password reset email sent.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "login" ? "Welcome back." :
    mode === "signup" ? "Create your account." :
    "Reset your password.";

  return (
    <main className="customer-auth-page">
      <section className="customer-auth-card">
        <p className="kicker blue">ANNA MOGA ACCOUNT</p>
        <h1>{title}</h1>

        <form onSubmit={handleSubmit} className="customer-auth-form">
          {mode === "signup" && (
            <div className="auth-name-grid">
              <label>
                <span>First name</span>
                <input name="firstName" autoComplete="given-name" required />
              </label>
              <label>
                <span>Last name</span>
                <input name="lastName" autoComplete="family-name" required />
              </label>
            </div>
          )}

          <label>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>

          {mode !== "forgot" && (
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={8}
                required
              />
            </label>
          )}

          <button className="btn primary" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset email"}
          </button>
        </form>

        {error && <p className="payment-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <div className="auth-links">
          {mode === "login" && (
            <>
              <Link href="/forgot-password">Forgot password?</Link>
              <span>New here? <Link href="/signup">Create an account</Link></span>
              <span>Staff? <Link href="/admin/login">Admin login</Link></span>
            </>
          )}
          {mode === "signup" && <span>Already have an account? <Link href="/login">Sign in</Link></span>}
          {mode === "forgot" && <Link href="/login">Back to sign in</Link>}
        </div>
      </section>
    </main>
  );
}
