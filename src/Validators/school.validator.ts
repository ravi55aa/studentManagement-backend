import * as z from "zod";

export const schoolMetaDataValidateSchema = 
    z.object({
        adminName: z.string().min(2, "Name too short"),
        schoolName: z.string().min(2, "Name too short"),
        email: z.string().email("Invalid email"),
        password: z
            .string()
            .min(6, "Password must be 6+ characters")
            .max(8, "Password must not be greater tha 8 characters"),
        reEnter: z.string(),
        profile: z.any().optional(),
        phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10 digits number").optional()
    })
    .refine((data) => data.password === data.reEnter, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });


export const schoolAddressValidateSchema =
    z.object({
        zip: z
            .string()
                .regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digits ZIP code "),

        street: z
            .string()
                .min(3, "Street name must be at least 3 characters")
                .max(50, "Street name is too long"),

        city: z
            .string()
                .min(3, "City name must be at least 3 characters")
                .max(30, "City name is too long"),

        state: z
            .string()
                .min(3, "State name must be at least 3 characters")
                .max(20, "State name is too long"),

        country: z
            .string()
                .min(3, "Country name must be at least 3 characters")
                .max(20, "Country name is too long"),
    })



export const schoolAcademicYearSchema = z.object({
    code: z
        .string()
        .min(2, "Code is required")
        .max(10, "Code is too long")
        .regex(/^[A-Z0-9]+$/, "Code must be uppercase (A–Z, 0–9)"),

    startDate: z
        .string()
        .refine(
        (val) => !Number.isNaN(Date.parse(val)),
        "Invalid start date"
        ),

    endDate: z
        .string()
        .refine(
        (val) => !Number.isNaN(Date.parse(val)),
        "Invalid end date"
        ),

    status: z
        .enum(["active", "inactive"])
    .optional(),

  tenantId: z.string().optional(), // injected from JWT 
  adminId: z.string().optional(),  // same here 
})
.refine(
    (data) =>
        new Date(data.endDate) > new Date(data.startDate),
    {
        message: "End date must be after start date",
        path: ["endDate"],
    }
);




/* ---------- School Academic Subjects ---------- */
const isObjectId = (val: string) =>
    /^[0-9a-fA-F]{24}$/.test(val);

export const schoolSubjectSchema = z
    .object({
        name: z
        .string()
        .min(3, "Subject name must be at least 3 characters")
        .trim(),

        code: z
        .string()
        .min(2, "Code is required")
        .regex(/^[A-Z0-9-_]+$/, "Code must be uppercase")
        .transform((val) => val.toUpperCase()),

        className: z
        .string()
        .min(1, "Class is required")
        .trim(),

        type: z.enum(
        ["theory", "practical", "both"],
        { message: "Subject type is required" }
        ),

        maxMarks: z
        .number({
            message: "Max marks is required",
        })
        .min(1, "Max marks must be greater than 0"),

        passMarks: z
        .number()
        .min(0, "Pass marks cannot be negative")
        .optional(),

        credits: z
        .number()
        .min(0, "Credits cannot be negative")
        .optional(),

        department: z
        .string()
        .optional()
        .transform((v) => v?.trim()),

        level: z
        .enum(
            ["primary", "secondary", "higher-secondary", "degree"],
            { message: "Invalid level" }
        )
        .optional(),

        academicYear: z
        .string()
        .refine(isObjectId, "Invalid academic year ID"),

        batchesToFollow: z
        .array(
            z.string().refine(String, "Invalid batch ID")
        )
        .min(1, "Select at least one batch"),

        description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .trim(),

        // Backend stores file URLs, NOT files
        referenceBooks: z
        .array(z.string().url("Invalid file URL"))
        .optional(),

        status: z
        .enum(["active", "inactive"])
        .default("active"),
    })
    .refine(
        (data) =>
        data.passMarks === undefined ||
        data.passMarks <= data.maxMarks,
        {
        message: "Pass marks cannot exceed max marks",
        path: ["passMarks"],
        }
    );




    //**  FESS  **// 
// Mongo ObjectId validation (24 hex characters)
export const autoReminderSchema = z
    .object({
        enabled: z.boolean(),

        daysBeforeDue: z
            .coerce
            .number({message:"Total capacity value is required"})
            .min(2, "Min capacity should be 10 ")
            .optional()
    })
    .refine(
        (data) => {
        if (data.enabled && !data.daysBeforeDue) {
            return false;
        }
        return true;
        },
        {
        message: "Days before due is required when reminder is enabled",
        path: ["daysBeforeDue"],
        }
    );

/* ---------------=MAIN FEE SCHEMA--------------------- */

export const feeSchema = z
    .object({
        name: z
        .string()
        .min(2, "Fee name must be at least 2 characters"),

        code: z
        .string()
        .min(2, "Fee code must be at least 2 characters"),

        type: z.string(),

        appliesTo: z.object({
        model: z.string(),
        id: z
            .string()
            .min(1, "Please select a valid reference"),
        }),

        status: z
        .string()
        .default("ACTIVE"),

        totalAmount: z.coerce
        .number({message:"Total capacity value is required"})
        .positive("Amount must be greater than 0"),
        
        dueDate: z.preprocess(
        (val) => (val ? new Date(val as string) : undefined),
            z.date({ error: "Due date is required" })
        ),

        currency: z
        .string()
        .min(2, "Currency required (e.g. INR, USD)"),

        autoReminder: autoReminderSchema,
    })

    /* ------------TYPE ↔ MODEL VALIDATION--------------- */
