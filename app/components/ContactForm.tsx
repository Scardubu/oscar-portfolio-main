"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/app/lib/validations";
import type { z } from "zod";

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      inquiryType: "job",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(
          (data && data.message) || "Something went wrong. Please try again.",
        );
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex max-w-2xl flex-col gap-8 rounded-2xl glass-panel p-8 shadow-2xl lg:p-12"
      aria-label="Contact form"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-300">
            Name *
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white transition-all outline-none focus:border-accent-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-primary/20"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white outline-none transition-all focus:border-accent-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-primary/20"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="company"
            className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-300"
          >
            Company (optional)
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white outline-none transition-all focus:border-accent-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-primary/20"
            {...register("company")}
          />
        </div>

        <div>
          <label
            htmlFor="inquiryType"
            className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-300"
          >
            Inquiry type
          </label>
          <div className="relative">
            <select
              id="inquiryType"
              className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white outline-none transition-all focus:border-accent-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-primary/20"
              {...register("inquiryType")}
            >
              <option value="job" className="bg-gray-900">Job opportunity</option>
              <option value="consulting" className="bg-gray-900">Consulting / ML project</option>
              <option value="collaboration" className="bg-gray-900">Collaboration</option>
              <option value="other" className="bg-gray-900">Other</option>
            </select>
          </div>
          {errors.inquiryType && (
            <p className="mt-1 text-xs text-error">{errors.inquiryType.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-300"
        >
          How can Oscar help?
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white outline-none transition-all focus:border-accent-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-primary/20"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-error">{errors.message.message}</p>
        )}
      </div>

      <div className="hidden">
        <label htmlFor="honeypot">Do not fill this field</label>
        <input
          id="honeypot"
          type="text"
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-accent-primary px-8 py-4 text-base font-bold text-black shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:bg-accent-primary/90 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-xs text-success">
          Message sent. Oscar will get back to you soon.
        </p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-xs text-error">{errorMessage}</p>
      )}
    </form>
  );
}
