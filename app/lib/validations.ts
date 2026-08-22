// Zod validation schemas (Phase 5)
// The honeypot accepts a bounded value so the API can silently acknowledge
// automated submissions without exposing the detection rule.
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  company: z.string().optional(),
  inquiryType: z.enum(['job', 'consulting', 'collaboration', 'advisory']).optional(),
  timeline: z.enum(['immediate', 'month', 'quarter', 'exploring']),
  stakes: z.string().min(5).max(240),
  message: z.string().min(10).max(500),
  // Honeypot: bots fill it, humans leave it empty. The route discards any
  // non-empty value after parsing; the bound prevents oversized payloads.
  honeypot: z.string().max(200).default(''),
});
