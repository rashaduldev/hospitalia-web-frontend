import z from "zod";

export const Searchschema = z.object({
  type: z.string(),
  city: z.string().min(1, "City is required"),
  searchKeyword: z.string().optional().or(z.literal("")),
});
