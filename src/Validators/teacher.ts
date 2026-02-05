import { string, z } from "zod";

/* ----------------------------------------
`ENUMS (keep in sync with backend)
---------------------------------------- */

const employmentStatusEnum = z.enum([
    "active",
    "inactive",
    "on_leave",
    "resigned",
    "terminated",
]);

    const designationEnum = z.enum([
    "teacher",
    "head_of_department",
    "assistant_teacher",
    "head_Master",
]);

const departmentEnum = z.enum([
    "mathematics",
    "science",
    "english",
    "social_science",
    "languages",
    "computer_science",
    "physical_education",
    "arts",
]);

/* ----------------------------------------
    OBJECT ID VALIDATION
---------------------------------------- */

const isObjectId = (val: string) =>
    /^[0-9a-fA-F]{24}$/.test(val);

/* ----------------------------------------
    CREATE TEACHER SCHEMA
---------------------------------------- */

export const createTeacherSchema = z.object({
    teacherId: z.string()
        .refine(isObjectId, "Invalid tenant ID"),
    academicYearId: z.string()
        .refine(isObjectId, "Invalid academic year ID"),
    centerId: z.string()
        .refine(isObjectId, "Invalid center ID"),

    employeeId: z
        .string()
        .min(3, "Employee ID is required"),

    classTeacherOf: z.string()
        .refine(isObjectId, "Invalid batch ID"),

    employmentStatus: employmentStatusEnum.optional(), // default handled in backend

    assignedSubjects: z
        .array(z.string()
        .refine(isObjectId, "Invalid Subject ID"))
        .min(1, "At least one subject must be assigned"),

    designation: designationEnum,

    department: z
        .array(departmentEnum)
        .min(1, "At least one department is required"),

    dateOfJoining: z.coerce.date(),

    dateOfLeaving: z.coerce.date().nullable().optional(),
});
