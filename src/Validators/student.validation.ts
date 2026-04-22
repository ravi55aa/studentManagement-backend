import { z } from 'zod';

import { uploadedDocSchema } from './teacher.validation';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),

  password: z
    .string()
    .min(6, 'Password must be 6+ characters')
    .max(12, 'Password must not be greater tha 8 characters'),

  email: z.string().email('Invalid email').optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .optional(),

  gender: z.enum(['male', 'female', 'other']).optional(),

  dateOfBirth: z.string().optional(),

  profile: z.string().optional(),

  parentName: z
    .string()
    .min(3, 'Parent name is required')
    .max(40, 'Give the name length under 40')
    .optional(),

  parentPhone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Parent phone must be 10 digits')
    .optional(),

  status: z.enum(['active', 'inactive', 'graduated', 'suspended']).optional(),

  centerId: objectId,
  batchId: objectId.optional(),
});

export const updateStudentSchema = z.object({
  admissionNumber: z.string().optional(),

  name: z.string().min(2).optional(),

  email: z.string().email().optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/)
    .optional(),

  rollNumber: z.string().optional(),

  gender: z.enum(['male', 'female', 'other']).optional(),

  dateOfBirth: z.string().optional(),

  parentName: z.string().optional(),

  parentPhone: z
    .string()
    .regex(/^[0-9]{10}$/)
    .optional(),

  status: z.enum(['active', 'inactive', 'graduated', 'suspended']).optional(),

  centerId: objectId.optional(),

  batchId: objectId.optional(),
});

/****** HOMEWORK SUBMISSION ******/
export const homeworkSubmissionSchema = z.object({
  note: z.string().trim().optional(),

  attachments: z.array(uploadedDocSchema).optional(),

  links: z.array(z.string().url('Invalid URL')).optional(),
});

//Leave document
export const leaveDocValidationSchema = z.object({
  reason: z.string().trim().min(5, 'Reason is required'),

  body: z.string().trim().min(10, 'Body is required'),

  attachment: z.string().url('Attachment must be a valid URL').optional(), // since it's not required
});
