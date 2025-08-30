import { z } from "zod";
export const userRegistrationSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.email(),
});
