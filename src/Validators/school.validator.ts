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