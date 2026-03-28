"use server";
// app/actions/contact.ts
// ─────────────────────────────────────────────────────────────────────────────
// Next.js 15 Server Action for contact form submission.
// Zod validation server-side — never trust client data.
// Returns structured state compatible with useActionState.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────

const ContactSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters").max(80),
  email:   z.string().email("Please enter a valid email address"),
  company: z.string().max(100).optional(),
  type:    z.enum(
    ["Job opportunity", "Consulting / ML project", "Collaboration", "Other"],
    { message: "Please select an inquiry type" }
  ),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be under 2000 characters"),
  honeypot: z.string().max(0, "Bot detected"), // empty = human
});

// ── State type ────────────────────────────────────────────────────────────────

export type ContactFormState = {
  status:  "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string[]>>;
};

export const initialContactState: ContactFormState = {
  status:  "idle",
  message: "",
};

// ── Server Action ─────────────────────────────────────────────────────────────

export async function submitContactForm(
  _prevState: ContactFormState,
  formData:   FormData
): Promise<ContactFormState> {
  // Parse form data
  const raw = {
    name:     formData.get("name"),
    email:    formData.get("email"),
    company:  formData.get("company") || undefined,
    type:     formData.get("type"),
    message:  formData.get("message"),
    honeypot: formData.get("honeypot") ?? "",
  };

  // Bot check — honeypot must be empty
  if (raw.honeypot !== "") {
    // Silently succeed to not reveal bot detection
    return { status: "success", message: "Message sent!" };
  }

  // Validate
  const result = ContactSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors as ContactFormState["errors"];
    return {
      status:  "error",
      message: "Please fix the errors below.",
      errors,
    };
  }

  const { name, email, company, type, message } = result.data;

  try {
    // ── Option 1: Formspree ────────────────────────────────────────────────
    // Replace FORMSPREE_FORM_ID with your actual form ID or env var
    const formspreeId = process.env.FORMSPREE_FORM_ID;

    if (formspreeId) {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Accept:         "application/json",
        },
        body: JSON.stringify({ name, email, company, type, message }),
      });

      if (!res.ok) {
        throw new Error(`Formspree error: ${res.status}`);
      }
    }

    // ── Option 2: Resend (uncomment and install @resend/node) ─────────────
    // const { Resend } = await import("@resend/node");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from:    "Portfolio Contact <noreply@scardubu.dev>",
    //   to:      "scardubu@gmail.com",
    //   subject: `[Portfolio] ${type} — ${name}`,
    //   text:    `From: ${name} <${email}>\nCompany: ${company ?? "N/A"}\nType: ${type}\n\n${message}`,
    // });

    return {
      status:  "success",
      message: "Message sent! I typically respond within 24 hours.",
    };
  } catch (err) {
    console.error("[ContactForm] Submission error:", err);
    return {
      status:  "error",
      message:
        "Something went wrong. Please email me directly at scardubu@gmail.com",
    };
  }
}
