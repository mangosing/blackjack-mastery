"use client";

import Link from "next/link";
import { useEffect, useState, type SubmitEvent } from "react";

import { getSupabaseClient } from "../../lib/supabase/client";

type RecoveryState = "checking" | "valid" | "invalid";

export default function ResetPasswordPage() {
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function checkSession() {
      try {
        const supabase = getSupabaseClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (isActive) {
          setRecoveryState(!error && session ? "valid" : "invalid");
        }
      } catch {
        if (isActive) {
          setRecoveryState("invalid");
        }
      }
    }

    void checkSession();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const passwordConfirmation = String(formData.get("passwordConfirmation"));

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage("Unable to update your password. Please try again.");
        return;
      }

      setIsComplete(true);
    } catch {
      setErrorMessage("Unable to update your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (recoveryState === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p role="status">Verifying reset link...</p>
      </main>
    );
  }

  if (recoveryState === "invalid") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <section className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold">Reset link unavailable</h1>
          <p role="alert" className="mt-4 text-sm text-red-600">
            This password-reset link is invalid or expired.
          </p>
          <p className="mt-6 text-sm">
            <Link href="/forgot-password" className="underline">
              Request another reset link
            </Link>
          </p>
        </section>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <section className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold">Password updated</h1>
          <p role="status" className="mt-4 text-sm text-green-600">
            Your password has been updated.
          </p>
          <p className="mt-6 text-sm">
            <Link href="/login" className="underline">
              Log in
            </Link>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Choose a new password</h1>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium">
              Confirm new password
            </label>
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              required
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          {errorMessage ? (
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
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
