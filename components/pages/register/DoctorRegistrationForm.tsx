"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { CountryAndPhoneInput } from "@/components/common/Country&PhoneInput";
import { useRouter } from "next/navigation";
import { getSpecialitiesAllCustomer } from "@/actions/speciality.customer";
import { useQuery } from "@tanstack/react-query";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTextarea } from "@/components/common/FormUIControllers/ControlledTextarea";
import { ControlledDateInput } from "@/components/common/FormUIControllers/ControlledDateInput";
import { register } from "@/actions/auth.actions";

export default function DoctorRegistrationForm() {
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
      specialityId: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["specialities"],
    queryFn: async () => {
      const res = await getSpecialitiesAllCustomer();

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.payload;
    },
  });
  const specialities = data?.content ?? [];

  const onSubmit = async ({
    firstName,
    lastName,
    gender,
    email,
    dateOfBirth,
    userType,
    countryCode,
    mobileNumber,
    password,
    designation,
    specialityId,
    onmsRegistrationNumber,
    professionalStatement,
  }: FormValues) => {
    const res = await register({
      firstName,
      lastName: lastName || "",
      gender,
      email,
      dateOfBirth,
      userType,
      countryCode,
      mobileNumber,
      password,

      professionalInfoRequest: {
        designation,
        specialityId: [Number(specialityId)],
        departmentId: [0],
        fileObjectId: 0,
        workPhoneNumber: "",
        onmsRegistrationNumber,
        professionalStatement: professionalStatement || "",
      },
    });

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }

    router.push("/doctor/login");
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
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
            ]}
          />

          {/* User Type */}
          <ControlledSelect
            name="userType"
            label="User Type"
            control={control}
            placeholder="Select user type"
            options={[
              { label: "Doctor", value: "DOCTOR" },
              { label: "Hospital", value: "HOSPITAL" },
              { label: "Secretary", value: "SECRETARY" },
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
          <ControlledDateInput
            name="dateOfBirth"
            label="Date of Birth"
            control={control}
            error={errors.dateOfBirth?.message}
          />

          {/* CountryCode with phone */}
          <CountryAndPhoneInput
            control={control}
            countrycode="countryCode"
            mobileNumber="mobileNumber"
            label="Phone"
            errors={errors}
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
            options={specialities.map((item) => ({
              label: item.name,
              value: String(item.id),
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
        {errors.root && (
          <p className="text-destructive text-xs font-semibold">
            {errors.root.message}
          </p>
        )}

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
