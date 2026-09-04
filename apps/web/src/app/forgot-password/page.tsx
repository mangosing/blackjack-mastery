"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";

import { getSupabaseClient } from "../../lib/supabase/client";

export default function ForgotPasswordPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setConfirmationMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMessage("Unable to send a reset link. Please try again.");
        return;
      }

      setConfirmationMessage(
        "If an account exists for that email, a password-reset link has been sent.",
      );
    } catch {
      setErrorMessage("Unable to send a reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Reset your password</h1>

        <p className="mt-2 text-sm">Enter your email and we’ll send you a password-reset link.</p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          {errorMessage ? (
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          {confirmationMessage ? (
            <p role="status" className="text-sm text-green-600">
              {confirmationMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-sm">
          <Link href="/login" className="underline">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
