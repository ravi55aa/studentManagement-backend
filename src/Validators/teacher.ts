import { z } from 'zod';
import { Gender_types } from '../types/enum';

/* -------`ENUMS (keep in sync with backend)--- */

const employmentStatusEnum = z.enum(['active', 'inactive', 'on_leave', 'resigned', 'terminated']);

const designationEnum = z.enum([
  'teacher',
  'head_of_department',
  'assistant_teacher',
  'head_Master',
]);

const departmentEnum = z.enum([
  'mathematics',
  'science',
  'english',
  'social_science',
  'languages',
  'computer_science',
  'physical_education',
  'arts',
]);

/* ----------OBJECT ID VALIDATION------------- */

const isObjectId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val);

/* -------------CREATE TEACHER SCHEMA------------- */

export const createTeacherSchema = z.object({
  teacherId: z.string().refine(isObjectId, 'Invalid tenant ID'),
  academicYearId: z.string().refine(isObjectId, 'Invalid academic year ID'),
  centerId: z.string().refine(isObjectId, 'Invalid center ID'),

  employeeId: z.string().min(3, 'Employee ID is required'),

  employmentStatus: employmentStatusEnum.optional(), // default handled in backend

  assignedSubjects: z
    .array(z.string().refine(isObjectId, 'Invalid Subject ID'))
    .min(1, 'At least one subject must be assigned'),

  designation: designationEnum,

  department: z.array(departmentEnum).min(1, 'At least one department is required'),

  dateOfJoining: z.coerce.date(),

  dateOfLeaving: z.coerce.date().nullable().optional(),
});

export const teacherBioFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .optional(),

  lastName: z
    .string()
    .min(1, 'Last name must be at least 1 character')
    .max(50, 'Last name is too long')
    .optional()
    .nullable(),

  email: z.string().email('Enter a valid email address').optional().nullable(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid phone number')
    .optional()
    .nullable(),

  qualification: z
    .string()
    .min(3, 'Qualification is Required')
    .max(100, 'Qualification is too long')
    .optional()
    .nullable(),

  dateOfBirth: z.coerce.date().optional(),

  experience: z.coerce
    .number()
    .min(1, 'Min 1 year of experience is required')
    .max(50, 'Experience seems invalid')
    .optional(),

  gender: z.enum(['male', 'female', 'other'], { message: 'Gender is required' }).optional(),
});
