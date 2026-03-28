// Zod validation schemas (Phase 5)
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  company: z.string().optional(),
  inquiryType: z.enum(['job', 'consulting', 'collaboration', 'other']),
  message: z.string().min(10).max(500),
  honeypot: z.string().max(0),
});
