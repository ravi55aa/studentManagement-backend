import { z } from 'zod';

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

export const createTeacherSchema = z
  .object({
    teacherId: z.string().refine(isObjectId, 'Invalid tenant ID'),
    academicYearId: z.string().refine(isObjectId, 'Invalid academic year ID'),
    center: z.string('Center is required'),

    modelType: z.enum(['School', 'Centers']),

    employeeId: z.string().min(3, 'Employee ID is required'),

    employmentStatus: employmentStatusEnum.optional(),

    designation: designationEnum.optional(),

    assignedSubjects: z.array(z.string().refine(isObjectId, 'Invalid Subject ID')).optional(),

    department: z.array(departmentEnum).optional(),

    dateOfJoining: z.coerce.date(),

    dateOfLeaving: z.coerce.date().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const isHOD = data.designation === 'head_Master';

    if (!isHOD) {
      if (!data.assignedSubjects || data.assignedSubjects.length === 0) {
        ctx.addIssue({
          path: ['assignedSubjects'],
          code: z.ZodIssueCode.custom,
          message: 'At least one subject must be assigned',
        });
      }

      if (!data.department || data.department.length === 0) {
        ctx.addIssue({
          path: ['department'],
          code: z.ZodIssueCode.custom,
          message: 'Department is required',
        });
      }
    }
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

//HOMEWORK
export const uploadedDocSchema = z.object({
  url: z.string().min(1, 'File url is required'),
  fileName: z.string().min(1, 'File name is required'),
});

export const HomeworkSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),

  description: z.string().min(1, 'Description is required'),

  subjectId: z.string().min(1, 'Subject ID is required'),

  batchId: z.string().min(1, 'Batch ID is required'),

  teacherId: z.string().min(1, 'Teacher ID is required'),

  status: z.enum(['pending', 'submitted', 'reviewed']),

  dueDate: z.coerce.date({
    error: 'Due date is required',
  }),

  attachments: z.array(uploadedDocSchema).nullable().optional(),

  isDelete: z.boolean().optional().default(false),
});
