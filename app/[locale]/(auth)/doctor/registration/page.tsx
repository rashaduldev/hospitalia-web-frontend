"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/pages/home/Header";
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

export default function DoctorRegistrationPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    console.log("FORM DATA", data);
  };

  return (
    <div>
      <Header />

      <h2 className="text-2xl text-card-foreground text-center p-7">
        Join Rendewou as a Provider
      </h2>

      <div className="min-h-screen bg-muted/40 px-4">
        <div className="container mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* PERSONAL INFO */}
            <div className="rounded-lg border bg-card p-6 space-y-5">
              <h3 className="text-2xl">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Name */}
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input type="text" {...register("name")} placeholder="Enter your name" />
                  <p className="text-xs text-destructive">{errors.name?.message}</p>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input type="number" {...register("phone")} placeholder="08012345678" />
                  <p className="text-xs text-destructive">{errors.phone?.message}</p>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label>Email (Optional)</Label>
                  <Input type="email" {...register("email")} placeholder="Enter your email" />
                  <p className="text-xs text-destructive">{errors.email?.message}</p>
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
                  <p className="text-xs text-destructive">{errors.gender?.message}</p>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input type="password" {...register("password")} placeholder="••••••••" />
                  <p className="text-xs text-destructive">{errors.password?.message}</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label>Confirm Password</Label>
                  <Input type="password" {...register("confirmPassword")} placeholder="••••••••" />
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword?.message}
                  </p>
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
                  <Input {...register("designation")} placeholder="Enter your title/designation" />
                  <p className="text-xs text-destructive">
                    {errors.designation?.message}
                  </p>
                </div>
                {/* Speciality */}
                  <div className="space-y-1">
                  <Label>Speciality</Label>
                  <Controller
                    name="speciality"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Enter your speciality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="gaini">Gynaecology</SelectItem>
                            <SelectItem value="teeth">Dentistry</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-xs text-destructive">
                    {errors.speciality?.message}
                  </p>
                </div>

                {/* ONMS */}
                <div className="space-y-1">
                  <Label>ONMS Registration Number (Optional)</Label>
                  <Input type="number" {...register("onms")} placeholder="Enter your ONMS Registration Number" />
                </div>
              </div>

              {/* Statement */}
              <div className="space-y-1">
                <Label>Professional Statement</Label>
                <Textarea
                  {...register("statement")}
                  placeholder="Enter statement"
                />
                <p className="text-xs text-destructive">
                  {errors.statement?.message}
                </p>
              </div>

              {/* Submit */}
              <div className="flex justify-center mt-6">
                <Button className="max-w-113 sm:px-20" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Register as a Healthcare Provider"}
                </Button>
              </div>
              <Link href="/doctor/login" className="text-sm font-medium text-primary text-center flex justify-center hover:underline">
              Already Have an Account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}