"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

export default function DoctorRegistrationForm() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "",
      mobileNumber: "",
      specialityId: undefined,
    },
    mode: "onChange",
  });
  const router = useRouter();
  const serverErrorHandler = useServerFormError<FormValues>(setError);
  useEffect(() => {
    const loadSpecialities = async () => {
      try {
        const res = await getSpecialitiesCustomer();
        setSpecialities(res?.payload?.content || []);
      } catch (error: any) {
        setError("root.serverError", {
          type: "manual",
          message: error.message || "Speciality fetch failed",
        });
      }
    };

    loadSpecialities();
  }, []);

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
      setTimeout(() => {
        router.push("/doctor/login");
      }, 5000);
    } catch (err: any) {
      serverErrorHandler(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* PERSONAL INFO */}
      <div className="rounded-lg border bg-card p-6 space-y-5">
        <h3 className="text-2xl">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* FirstName */}
          <div className="space-y-1">
            <Label>First Name</Label>
            <Input
              type="text"
              {...register("firstName")}
              placeholder="Enter your name"
            />
            {errors.firstName?.message && (
              <p className="text-xs text-destructive">
                {errors.firstName?.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <Label>Last Name</Label>
            <Input
              type="text"
              {...register("lastName")}
              placeholder="Enter your name"
            />
            {errors.lastName?.message && (
              <p className="text-xs text-destructive">
                {errors.lastName?.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <Label>Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender?.message && (
              <p className="text-xs text-destructive">
                {errors.gender?.message}
              </p>
            )}
          </div>
          {/* User Type */}
          <div className="space-y-1">
            <Label>User Type</Label>
            <Controller
              name="userType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>usertype</SelectLabel>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userType?.message && (
              <p className="text-xs text-destructive">
                {errors.userType?.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email (Optional)</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email?.message && (
              <p className="text-xs text-destructive">
                {errors.email?.message}
              </p>
            )}
          </div>

          {/* dateOfBirth */}
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
                      className="justify-start font-normal"
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
          <div className="space-y-1 relative">
            <Label>Password</Label>

            <Input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
            />

            <div
              onClick={() => setShowPassword((p) => !p)}
              className="absolute cursor-pointer top-9 right-2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </div>

            {errors.password?.message && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 relative">
            <Label>Confirm Password</Label>

            <Input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="••••••••"
            />

            <div
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute cursor-pointer top-9 right-2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </div>

            {errors.confirmPassword?.message && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PROFESSIONAL INFO */}
      <div className="rounded-lg border bg-card p-6 space-y-5 my-12">
        <h3 className="text-2xl">Professional Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Designation */}
          <div className="space-y-1">
            <Label>Title / Designation</Label>
            <Input
              {...register("designation")}
              placeholder="Enter your title/designation"
            />
            {errors.designation?.message && (
              <p className="text-xs text-destructive">
                {errors.designation?.message}
              </p>
            )}
          </div>
          {/* speciality */}
          <div className="space-y-1">
            <Label>Speciality</Label>
            <Controller
              name="specialityId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select speciality" />
                  </SelectTrigger>

                  <SelectContent position="popper" sideOffset={4}>
                    <SelectGroup>
                      <SelectLabel>Speciality</SelectLabel>

                      {specialities.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.specialityId?.message && (
              <p className="text-xs text-destructive">
                {errors.specialityId.message}
              </p>
            )}
          </div>

          {/* ONMS */}
          <div className="space-y-1">
            <Label>ONMS Registration Number (Optional)</Label>
            <Input
              type="text"
              {...register("onmsRegistrationNumber")}
              placeholder="Enter your ONMS Registration Number"
            />
          </div>
        </div>

        {/* Statement */}
        <div className="space-y-1">
          <Label>Professional Statement</Label>
          <Textarea
            {...register("professionalStatement")}
            placeholder="Enter statement"
          />
          {errors.professionalStatement?.message && (
            <p className="text-xs text-destructive">
              {errors.professionalStatement?.message}
            </p>
          )}
        </div>
        {/* success or error message show */}
        <div className="space-y-2">
          <FormError message={errors.root?.serverError?.message} />
          {success && (
            <FormSuccess message="Account created successfully! Redirecting to login..." />
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <Button
            className="max-w-113 sm:px-20"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Register as a Healthcare Provider"}
          </Button>
        </div>
        <Link
          href="/doctor/login"
          className="text-sm font-medium text-primary text-center flex justify-center hover:underline"
        >
          Already Have an Account?
        </Link>
      </div>
    </form>
  );
}
