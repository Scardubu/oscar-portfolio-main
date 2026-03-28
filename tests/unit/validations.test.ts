import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/app/lib/validations';

describe('contactSchema validation', () => {
  it('should validate correct contact form data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      inquiryType: 'job' as const,
      message: 'I am interested in your ML engineering position.',
      honeypot: '',
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject name that is too short', () => {
    const invalidData = {
      name: 'J',
      email: 'john@example.com',
      inquiryType: 'job' as const,
      message: 'Test message here',
      honeypot: '',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email format', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email',
      inquiryType: 'job' as const,
      message: 'Test message here',
      honeypot: '',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject message that is too short', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'job' as const,
      message: 'Short',
      honeypot: '',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject message that is too long', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'job' as const,
      message: 'a'.repeat(501),
      honeypot: '',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject non-empty honeypot field', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'job' as const,
      message: 'Test message here',
      honeypot: 'spam content',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept valid inquiry types', () => {
    const types = ['job', 'consulting', 'collaboration', 'other'] as const;

    types.forEach((type) => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        inquiryType: type,
        message: 'Test message here',
        honeypot: '',
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid inquiry type', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'invalid-type',
      message: 'Test message here',
      honeypot: '',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should allow optional company field', () => {
    const dataWithoutCompany = {
      name: 'John Doe',
      email: 'john@example.com',
      inquiryType: 'job' as const,
      message: 'Test message here',
      honeypot: '',
    };

    const result = contactSchema.safeParse(dataWithoutCompany);
    expect(result.success).toBe(true);
  });
});
