// Zod validation schemas (Phase 5)
// v5.1: inquiryType 'other' → 'advisory'.
//   Root cause: ContactSection.tsx last INQUIRY_TYPES entry had value='other'
//   but label='Advisory'. The email template uses inquiryType.toUpperCase() in
//   the subject line and body — Oscar's inbox was receiving "OTHER inquiry" and
//   "Type: other" when the sender had selected "Advisory". The value now matches
//   the label semantically. ContactSection.tsx INQUIRY_TYPES updated in lockstep.
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  company: z.string().optional(),
  inquiryType: z.enum(['job', 'consulting', 'collaboration', 'advisory']),
  message: z.string().min(10).max(500),
  honeypot: z.string().max(0),
});