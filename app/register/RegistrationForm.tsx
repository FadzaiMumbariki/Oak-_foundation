"use client";

import { useActionState } from "react";
import { registerAttendee, FormState } from "@/app/actions/register";

const initialState: FormState = {};

const ROLE_OPTIONS = [
  "Partner",
  "OAK Staff",
  "Coordination Team",
  "Presenter",
  "Observer",
];

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );
}

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls = (err?: string) =>
  `w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-white
   outline-none transition-all
   ${err
     ? "border-red-400 ring-1 ring-red-300 focus:border-red-400"
     : "border-gray-200 focus:border-[#1B2B4B] focus:ring-2 focus:ring-[#1B2B4B]/10"
   }`;

export default function RegistrationForm() {
  const [state, formAction, isPending] = useActionState(registerAttendee, initialState);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-4" aria-label="Attendee registration form">
      {/* Global error */}
      {state.error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Registration failed:</strong> {state.error}
        </div>
      )}

      {/* First + Last name — side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="first_name" required>First Name</Label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            placeholder="Maria"
            className={inputCls(fe.full_name)}
          />
        </div>
        <div>
          <Label htmlFor="last_name" required>Last Name</Label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            placeholder="Schmidt"
            className={inputCls(fe.full_name)}
          />
          <FieldError msg={fe.full_name} />
        </div>
      </div>

      {/* Organisation */}
      <div>
        <Label htmlFor="organization" required>Organisation</Label>
        <input
          id="organization"
          name="organization"
          type="text"
          placeholder="Your organisation name"
          className={inputCls(fe.organization)}
        />
        <FieldError msg={fe.organization} />
      </div>

      {/* Sub-partner */}
      <div>
        <Label htmlFor="sub_partner">Sub-Partner / Programme Area</Label>
        <input
          id="sub_partner"
          name="sub_partner"
          type="text"
          placeholder="Optional"
          className={inputCls()}
        />
      </div>

      {/* Role / Capacity — dropdown */}
      <div>
        <Label htmlFor="role_title" required>Role / Capacity</Label>
        <div className="relative">
          <select
            id="role_title"
            name="role_title"
            defaultValue=""
            className={`${inputCls(fe.role_title)} appearance-none pr-9 cursor-pointer`}
          >
            <option value="" disabled>Select your role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <FieldError msg={fe.role_title} />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" required>Email Address</Label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@organisation.org"
          className={inputCls(fe.email)}
        />
        <FieldError msg={fe.email} />
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+41 xx xxx xx xx"
          className={inputCls(fe.phone)}
        />
        <FieldError msg={fe.phone} />
      </div>

      {/* Requirements section */}
      <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 pt-4 pb-4 space-y-4">
        <p className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">Requirements</p>

        {/* Dietary */}
        <div>
          <Label htmlFor="dietary_needs">Dietary Requirements</Label>
          <input
            id="dietary_needs"
            name="dietary_needs"
            type="text"
            placeholder="e.g. Vegetarian, Halal, Gluten-free"
            className={inputCls()}
          />
        </div>

        {/* Accessibility */}
        <div>
          <Label htmlFor="accessibility_needs">Accessibility Requirements</Label>
          <input
            id="accessibility_needs"
            name="accessibility_needs"
            type="text"
            placeholder="e.g. Wheelchair access, hearing loop"
            className={inputCls()}
          />
        </div>

        {/* Travel */}
        <div>
          <Label htmlFor="travel_needs">Travel &amp; Accommodation</Label>
          <input
            id="travel_needs"
            name="travel_needs"
            type="text"
            placeholder="e.g. Flight from London, hotel needed"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Consent */}
      <div className={`rounded-xl border p-4 ${fe.consent_given ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            id="consent_given"
            name="consent_given"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#1B2B4B] cursor-pointer"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            I agree to OAK Foundation&apos;s{" "}
            <a href="#" className="text-[#1B2B4B] underline underline-offset-2 font-medium">
              privacy policy
            </a>{" "}
            and consent to my registration data being used for event coordination.
          </span>
        </label>
        <FieldError msg={fe.consent_given} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#1B2B4B] py-3.5 text-sm font-bold text-white transition-all
                   hover:bg-[#243a63] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Registering…
          </span>
        ) : (
          "Register"
        )}
      </button>

      <p className="text-center text-[11px] text-gray-400">
        Your data is secured and handled by OAK Foundation in accordance with GDPR.
      </p>
    </form>
  );
}
