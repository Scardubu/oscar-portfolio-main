"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { trackEvent } from "@/app/lib/analytics";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  projectType: z.enum(["consulting", "full-time", "contract", "other"]),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mbleoaqn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        trackEvent("Contact", "Form Submit", data.projectType);
        toast.success("Message sent! I’ll follow up soon with the best next step.", {
          duration: 5000,
          icon: "🚀",
        });
        reset();
        onClose();
      } else {
        throw new Error("Failed to send message");
      }
    } catch {
      toast.error(
        "Oops! Something went wrong. Try emailing scardubu@gmail.com directly.",
        {
          duration: 6000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 p-6">
                <div>
                  <h2
                    id="contact-modal-title"
                    className="text-2xl font-bold text-white"
                  >
                    Ship your next ML or AI product
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Tell me about the use case, and I&apos;ll reply with concrete
                    next steps as soon as I can.
                  </p>
                </div>
                <button
                  onClick={() => {
                    trackEvent("Contact", "Close Modal");
                    onClose();
                  }}
                  className="text-slate-400 transition-colors hover:text-white"
                  aria-label="Close contact form"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Your Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="john@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Project Type */}
                <div>
                  <label
                    htmlFor="projectType"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    What are you looking for? *
                  </label>
                  <select
                    {...register("projectType")}
                    id="projectType"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select an option</option>
                    <option value="consulting">AI/ML Consulting</option>
                    <option value="full-time">Full-Time Role</option>
                    <option value="contract">Contract/Freelance</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.projectType && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Your Message *
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={5}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Tell me about your project, challenges, or how I can help..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Or email me directly at{" "}
                  <a
                    href="mailto:scardubu@gmail.com"
                    className="text-cyan-400 hover:underline"
                  >
                    scardubu@gmail.com
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
