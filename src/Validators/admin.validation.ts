import { z } from 'zod';

export const planSchema = z.object({
  name: z.string().min(3, 'Plan name must be at least 3 characters'),

  description: z.string().optional(),

  amount: z.number().min(1, 'Amount must be greater than 0'),

  discount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .optional(),

  finalAmount: z.number().min(0, 'Final amount must be >= 0'),

  duration: z.number().min(1, 'Duration must be at least 1 day'),

  benefits: z
    .array(z.string().min(1, 'Benefit cannot be empty'))
    .min(1, 'At least one benefit is required'),

  maxStudents: z.number().min(1, 'Must allow at least 1 student').optional(),

  maxTeachers: z.number().min(1, 'Must allow at least 1 teacher').optional(),

  isActive: z.boolean(),

  isPopular: z.boolean(),
});
