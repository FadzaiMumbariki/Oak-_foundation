"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { lookupAttendeeByEmail, LookupResult } from "@/app/actions/lookup";

type FormState = { result?: LookupResult };

const initialState: FormState = {};

async function lookupAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = (formData.get("email") as string) ?? "";
  const result = await lookupAttendeeByEmail(email);
  return { result };
}

export default function AttendeeLookupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    lookupAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Redirect client-side after a successful lookup
  useEffect(() => {
    if (state.result?.status === "found") {
      router.push(`/attendee/${state.result.token}`);
    }
  }, [state.result, router]);

  const result = state.result;

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="oak-section-card space-y-4"
      aria-label="Find my attendee pass"
    >
      {/* Email field */}
      <div>
        <label htmlFor="lookup-email" className="oak-label">
          Email Address
        </label>
        <input
          id="lookup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@organisation.org"
          className="oak-input"
          disabled={isPending || result?.status === "found"}
        />
      </div>

      {/* Feedback messages */}
      {result?.status === "not_found" && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <strong>No registration found</strong> for that email address. Please
          check for typos or{" "}
          <a
            href="/register"
            className="font-semibold text-amber-900 underline"
          >
            register now
          </a>
          .
        </div>
      )}

      {result?.status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {result.message}
        </div>
      )}

      {result?.status === "found" && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <strong>Found!</strong> Redirecting to your pass…
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || result?.status === "found"}
        className="oak-btn-primary w-full"
      >
        {isPending ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Looking up…
          </>
        ) : (
          <>
            Find My Pass
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
