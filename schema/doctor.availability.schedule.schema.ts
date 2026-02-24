import z from "zod";

export const AvailabilityScheduleSchema = z.object({
  loc1: z.object({
    availabilityStatus: z.string().min(1, "Status is required"),
    doctorLocationId: z.string().min(1, "Location is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    timeSlot: z.string().min(1, "Time slot is required"),
  }),
  loc2: z.object({
    availabilityStatus: z.string().optional(),
    doctorLocationId: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    timeSlot: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.doctorLocationId) {
      if (!data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time is required",
          path: ["startTime"],
        });
      }
      if (!data.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time is required",
          path: ["endTime"],
        });
      }
    }
  }),
});

export type AvailabilityScheduleSchemaFormValues = z.infer<typeof AvailabilityScheduleSchema>;