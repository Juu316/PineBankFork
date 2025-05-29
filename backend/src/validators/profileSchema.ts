import { z } from "zod";

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Нэр хамгийн багадаа 2 оронтой байх ёстой")
    .optional(),
  lastName: z
    .string()
    .min(2, "Овог хамгийн багадаа 2 оронтой байх ёстой")
    .optional(),
  phone: z
    .string()
    .min(8, "Утасны дугаар 8 оронтой байх ёстой")
    .max(8, "Утасны дугаар 8 оронтой байх ёстой")
    .regex(/^\d+$/, "Утасны дугаар зөвхөн тооноос бүрдэх ёстой")
    .optional(),
  adress: z
    .string()
    .optional(),
  image: z.string().url("Зурагны URL зөв байх ёстой").optional(),
});


