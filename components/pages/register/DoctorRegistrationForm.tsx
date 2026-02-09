"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Eye, EyeOff } from "lucide-react";
import { CountryAndPhoneInput } from "@/components/common/Country&PhoneInput";
import { registerAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { FormError, FormSuccess } from "@/components/common/Feedback";
import { getSpecialitiesCustomer } from "@/actions/speciality.customer";
import { useServerFormError } from "@/hooks/useServerFormError";
import { useQuery } from "@tanstack/react-query";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTextarea } from "@/components/common/FormUIControllers/ControlledTextarea";

export default function DoctorRegistrationForm() {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      designation: "",
      countryCode: "",
      mobileNumber: "",
      specialityId: undefined,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const serverErrorHandler = useServerFormError<FormValues>(setError);

  const { data: specialities = [] } = useQuery({
    queryKey: ["specialities"],
    queryFn: async () => {
      try {
        const res = await getSpecialitiesCustomer();
        return res?.payload?.content || [];
      } catch (error: any) {
        serverErrorHandler(error);
      }
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName || "",
      gender: data.gender.toUpperCase(),
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      userType: data.userType.toUpperCase(),
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      password: data.password,
      professionalInfoRequest: {
        designation: data.designation,
        specialityId: [Number(data.specialityId)],
        departmentId: [0],
        fileObjectId: 0,
        workPhoneNumber: "",
        onmsRegistrationNumber: data.onmsRegistrationNumber,
        professionalStatement: data.professionalStatement || "",
      },
    };
    try {
      await registerAction(payload);
      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push("/doctor/login");
    } catch (err: any) {
      serverErrorHandler(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* PERSONAL INFO */}
      <div className="rounded-lg border bg-card p-6 space-y-5">
        <h3 className="text-2xl font-semibold">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* First Name */}
          <ControlledInput
            name="firstName"
            label="First Name"
            control={control}
            placeholder="Enter your first name"
          />

          {/* Last Name */}
          <ControlledInput
            name="lastName"
            label="Last Name"
            control={control}
            placeholder="Enter your last name"
          />

          {/* Gender */}
          <ControlledSelect
            name="gender"
            label="Gender"
            control={control}
            placeholder="Choose your gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Others", value: "others" },
            ]}
          />

          {/* User Type */}
          <ControlledSelect
            name="userType"
            label="User Type"
            control={control}
            placeholder="Select user type"
            options={[
              { label: "Doctor", value: "doctor" },
              { label: "Hospital", value: "hospital" },
              { label: "Secretary", value: "secretary" },
            ]}
          />

          {/* Email */}
          <ControlledInput
            name="email"
            label="Email (Optional)"
            type="email"
            control={control}
            placeholder="Enter your email"
          />

          {/* Date of Birth */}
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <Field className="w-full">
                <FieldLabel>Date of birth</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start font-normal w-full"
                    >
                      {field.value
                        ? new Date(field.value).toLocaleDateString()
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (!date) return;
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const dd = String(date.getDate()).padStart(2, "0");
                        field.onChange(`${yyyy}-${mm}-${dd}`);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* CountryCode with phone */}
          <CountryAndPhoneInput
            control={control}
            nameCode="countryCode"
            mobileNumber="mobileNumber"
            label="Phone"
            error={errors.mobileNumber?.message}
          />

          {/* Password */}
          <div className="relative">
            <ControlledInput
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              control={control}
              placeholder="••••••••"
            />
            <div
              onClick={() => setShowPassword((p) => !p)}
              className="absolute cursor-pointer top-7 right-3"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <ControlledInput
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              control={control}
              placeholder="••••••••"
            />
            <div
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute cursor-pointer top-7 right-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL INFO */}
      <div className="rounded-lg border bg-card p-6 space-y-5 my-12">
        <h3 className="text-2xl font-semibold">Professional Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Designation */}
          <ControlledInput
            name="designation"
            label="Title / Designation"
            control={control}
            placeholder="Enter your title/designation"
          />

          {/* Speciality */}
          <ControlledSelect
            name="specialityId"
            label="Speciality"
            control={control}
            placeholder="Select speciality"
            options={specialities.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          {/* ONMS Registration Number */}
          <ControlledInput
            name="onmsRegistrationNumber"
            label="ONMS Registration Number (Optional)"
            control={control}
            placeholder="Enter your registration number"
          />
        </div>

        {/* Professional Statement */}
        <ControlledTextarea
          name="professionalStatement"
          label="Professional Statement"
          control={control}
          placeholder="Write your professional statement"
        />

        {/* Feedback Messages */}
        <div className="space-y-2">
          {errors.root?.serverError?.message && (
            <FormError message={errors.root.serverError.message} />
          )}
          {success && (
            <FormSuccess message="Account created successfully! Redirecting to login..." />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <Button
            className="w-full max-w-md"
            type="submit"
            disabled={isSubmitting || success}
          >
            {isSubmitting
              ? "Creating account..."
              : "Register as a Healthcare Provider"}
          </Button>

          <Link
            href="/doctor/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            Already Have an Account?
          </Link>
        </div>
      </div>
    </form>
  );
}
