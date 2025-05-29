import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().nonempty("Овогоо оруулна уу"),
  lastName: z.string().nonempty("Нэрээ оруулна уу"),
  phone: z
    .string()
    .nonempty("Утасны дугаараа оруулна уу")
    .min(8, "Утасны дугаар 8 оронтой байна"),
  address: z.string().nonempty("Хаягаа оруулна уу"),
  image: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
