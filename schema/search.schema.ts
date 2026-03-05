import * as z from "zod";

export const searchSchema = z.object({
  type: z.enum(["doctor", "hospital"]),
  searchKeyword: z.string().min(1, "Please enter a name or keyword"),
});

export type searchFormValues = z.infer<typeof searchSchema>;
