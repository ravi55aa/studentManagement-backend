import {z} from "zod";

export const RegisterUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});