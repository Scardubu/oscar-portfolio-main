// Zod validation schemas (Phase 5)
// v1.1 FIX: honeypot now has `.default('')` so it validates correctly
// whether the client sends the field or omits it entirely.
// The API still silently discards any non-empty honeypot value.
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  company: z.string().optional(),
  inquiryType: z.enum(['job', 'consulting', 'collaboration', 'advisory']),
  message: z.string().min(10).max(500),
  // Honeypot: bots fill it, humans leave it empty.
  // .default('') ensures validation passes even if the field is absent.
  // .max(0) ensures the value must be empty to pass.
  honeypot: z.string().max(0).default(''),
});
