import { z } from 'zod';

// Contact Form Validation Schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\d\s\-+()]+$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  type: z.enum(['general', 'volunteer', 'partnership']).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Donation Form Validation Schema
export const donationFormSchema = z.object({
  amount: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid amount greater than 0',
    }),
  customAmount: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Please enter a valid amount greater than 0',
    }),
  frequency: z.enum(['one-time', 'monthly', 'yearly']),
  donorName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  donorEmail: z.string()
    .email('Please enter a valid email address'),
  donorPhone: z.string()
    .optional()
    .refine((val) => !val || /^[\d\s\-+()]+$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  message: z.string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: 'Message must be less than 500 characters',
    }),
  anonymous: z.boolean().optional(),
  newsletter: z.boolean().optional(),
});

export type DonationFormData = z.infer<typeof donationFormSchema>;
