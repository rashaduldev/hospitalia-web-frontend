import { z } from "zod";


export const loginFormSchema = (t: (key: string) => string) =>
  z.object({
    countryCode: z
      .string()
      .nonempty(t("login.errors.countryRequired")),
    phoneNumber: z
      .string()
      .nonempty(t("login.errors.phoneRequired"))
      .min(4, t("login.errors.phoneShort"))
      .max(15, t("login.errors.phoneLong")),

    password: z
      .string()
      .min(6, t("login.errors.passwordMin")),
  });

export type LoginFormValues = z.infer<
  ReturnType<typeof loginFormSchema>
>;

// Doctor Registration schema
export const formSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
    email: z.email("Invalid email").optional().or(z.literal("")),
    dateOfBirth: z.string().optional().or(z.literal("")),
    userType: z.enum(["DOCTOR", "HOSPITAL", "SECRETARY"], { message: "UserType is required" }),
    countryCode: z.string().nonempty("CountryCode is required"),
    mobileNumber: z
      .string()
      .nonempty("Mobile number is required")
      .min(4, "MobileNumber number is too short")
      .max(15, "MobileNumber number is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must have a digit, a special character and a capital letter and a small letter",
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    designation: z.string().min(2, "Designation is required"),
    specialityId: z.string().min(1,"Speciality is required"),
    onmsRegistrationNumber: z.string().optional(),
    professionalStatement: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;
