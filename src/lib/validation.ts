import { ZodError, z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter.")
  .max(72, "Password maksimal 72 karakter.");

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email tidak valid.")
    .transform((value) => value.toLowerCase()),
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter.")
    .max(80, "Nama maksimal 80 karakter."),
});

export function getFirstErrorMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Input tidak valid.";
}
