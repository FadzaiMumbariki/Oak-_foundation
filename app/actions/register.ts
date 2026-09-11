"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { RegistrationFormData } from "@/lib/types";
import { redirect } from "next/navigation";

export type FormState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof RegistrationFormData | "full_name", string>>;
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  if (!phone) return true;
  return /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
}

export async function registerAttendee(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Combine first + last name from split fields
  const firstName = (formData.get("first_name") as string)?.trim() ?? "";
  const lastName  = (formData.get("last_name")  as string)?.trim() ?? "";
  const full_name = [firstName, lastName].filter(Boolean).join(" ");

  const data: RegistrationFormData = {
    full_name,
    email:                (formData.get("email")                as string)?.trim().toLowerCase() ?? "",
    phone:                (formData.get("phone")                as string)?.trim() ?? "",
    organization:         (formData.get("organization")         as string)?.trim() ?? "",
    sub_partner:          (formData.get("sub_partner")          as string)?.trim() ?? "",
    role_title:           (formData.get("role_title")           as string)?.trim() ?? "",
    dietary_needs:        (formData.get("dietary_needs")        as string)?.trim() ?? "",
    accessibility_needs:  (formData.get("accessibility_needs")  as string)?.trim() ?? "",
    travel_needs:         (formData.get("travel_needs")         as string)?.trim() ?? "",
    consent_given:        formData.get("consent_given") === "on",
  };

  // ── Validation ──────────────────────────────────────
  const fieldErrors: FormState["fieldErrors"] = {};

  if (!firstName || !lastName) fieldErrors.full_name = "First and last name are required.";
  if (!data.email) {
    fieldErrors.email = "Email address is required.";
  } else if (!validateEmail(data.email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (data.phone && !validatePhone(data.phone)) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }
  if (!data.organization) fieldErrors.organization = "Organisation is required.";
  if (!data.role_title)   fieldErrors.role_title   = "Please select your role.";
  if (!data.consent_given) fieldErrors.consent_given = "You must agree to the privacy policy to register.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  // ── Database insert ──────────────────────────────────
  let targetToken = "";

  if (!isSupabaseConfigured()) {
    targetToken = "mock-" + Math.random().toString(36).substring(2, 10);
  } else {
    try {
      const supabase = await createClient();

      const { data: inserted, error } = await supabase
        .from("attendees")
        .insert({
          full_name:           data.full_name,
          email:               data.email,
          phone:               data.phone || null,
          organization:        data.organization,
          sub_partner:         data.sub_partner || null,
          role_title:          data.role_title,
          dietary_needs:       data.dietary_needs || null,
          accessibility_needs: data.accessibility_needs || null,
          travel_needs:        data.travel_needs || null,
          consent_given:       true,
        })
        .select("qr_token")
        .single();

      if (error) {
        if (error.code === "23505") {
          return {
            fieldErrors: {
              email: "This email address is already registered. Contact the coordination team if you need help.",
            },
          };
        }
        console.error("Registration error:", error);
        return { error: "Registration failed. Please try again or contact the team." };
      }

      targetToken = inserted.qr_token;
    } catch (err) {
      console.error("Registration server exception:", err);
      targetToken = "mock-" + Math.random().toString(36).substring(2, 10);
    }
  }

  redirect(`/attendee/${targetToken}`);
}
