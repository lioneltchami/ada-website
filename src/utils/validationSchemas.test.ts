import { describe, it, expect } from 'vitest';
import { contactFormSchema, donationFormSchema } from './validationSchemas';

describe('contactFormSchema', () => {
  describe('name validation', () => {
    it('should accept valid names', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      });
      expect(result.success).toBe(true);
    });

    it('should reject names with less than 2 characters', () => {
      const result = contactFormSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
      }
    });

    it('should reject names with more than 100 characters', () => {
      const result = contactFormSchema.safeParse({
        name: 'a'.repeat(101),
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be less than 100 characters');
      }
    });
  });

  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      validEmails.forEach(email => {
        const result = contactFormSchema.safeParse({
          name: 'John Doe',
          email,
          subject: 'Test',
          message: 'Test message with enough characters',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      invalidEmails.forEach(email => {
        const result = contactFormSchema.safeParse({
          name: 'John Doe',
          email,
          subject: 'Test',
          message: 'Test message',
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('phone validation', () => {
    it('should accept valid phone numbers', () => {
      const validPhones = [
        '+237 123 456 789',
        '(123) 456-7890',
        '123-456-7890',
        '1234567890',
      ];

      validPhones.forEach(phone => {
        const result = contactFormSchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          phone,
          subject: 'Test',
          message: 'Test message with enough characters',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept empty phone (optional)', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message with enough characters',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        'abc123',
        'phone number',
        '###-###-####',
      ];

      invalidPhones.forEach(phone => {
        const result = contactFormSchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          phone,
          subject: 'Test',
          message: 'Test message',
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('subject validation', () => {
    it('should accept valid subjects', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Valid Subject',
        message: 'Test message with enough characters',
      });
      expect(result.success).toBe(true);
    });

    it('should reject subjects with less than 3 characters', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Ab',
        message: 'Test message',
      });
      expect(result.success).toBe(false);
    });

    it('should reject subjects with more than 200 characters', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'a'.repeat(201),
        message: 'Test message',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('message validation', () => {
    it('should accept valid messages', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a valid message with enough characters',
      });
      expect(result.success).toBe(true);
    });

    it('should reject messages with less than 10 characters', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject messages with more than 2000 characters', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'a'.repeat(2001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('type validation', () => {
    it('should accept valid types', () => {
      const types = ['general', 'volunteer', 'partnership'] as const;

      types.forEach(type => {
        const result = contactFormSchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test',
          message: 'Test message with enough characters',
          type,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept undefined type (optional)', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message with enough characters',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('donationFormSchema', () => {
  describe('amount validation', () => {
    it('should accept valid amounts', () => {
      const validAmounts = ['10', '50.50', '100', '1000.99'];

      validAmounts.forEach(amount => {
        const result = donationFormSchema.safeParse({
          amount,
          frequency: 'one-time',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject zero or negative amounts', () => {
      const invalidAmounts = ['0', '-10', '-50.50'];

      invalidAmounts.forEach(amount => {
        const result = donationFormSchema.safeParse({
          amount,
          frequency: 'one-time',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject non-numeric amounts', () => {
      const result = donationFormSchema.safeParse({
        amount: 'not a number',
        frequency: 'one-time',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('frequency validation', () => {
    it('should accept valid frequencies', () => {
      const frequencies = ['one-time', 'monthly', 'yearly'] as const;

      frequencies.forEach(frequency => {
        const result = donationFormSchema.safeParse({
          amount: '50',
          frequency,
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid frequencies', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'weekly',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('donorName validation', () => {
    it('should accept valid donor names', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'one-time',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject names with less than 2 characters', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'one-time',
        donorName: 'J',
        donorEmail: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('donorEmail validation', () => {
    it('should accept valid email addresses', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'one-time',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'one-time',
        donorName: 'John Doe',
        donorEmail: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('optional fields', () => {
    it('should accept optional fields when provided', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'one-time',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        donorPhone: '+237 123 456 789',
        message: 'This is a donation message',
        anonymous: true,
        newsletter: false,
      });
      expect(result.success).toBe(true);
    });

    it('should accept when optional fields are omitted', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'one-time',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject message longer than 500 characters', () => {
      const result = donationFormSchema.safeParse({
        amount: '50',
        frequency: 'one-time',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        message: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
    });
  });
});
