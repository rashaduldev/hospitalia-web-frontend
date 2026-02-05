"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/pages/home/Header";
import { LoginformSchema, LoginFormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function DoctorRLoginPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginformSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("LOGIN FORM DATA", data);
  };

  return (
    <div>
      <Header />
      <div className="min-h-[80vh] sm:min-h-screen px-4 flex items-center">
        <div className="max-w-111.5 mx-auto w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h3 className="text-xl leading-7"> Login as a Provider</h3>
              <p className="mb-8 text-sm">Enter your details below to login</p>

              <div className="space-y-4">
                {/* Phone */}
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input type="number" {...register("phone")} placeholder="08012345678" />
                  <p className="text-xs text-destructive">{errors.phone?.message}</p>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input type="password" {...register("password")} placeholder="••••••••" />
                  <p className="text-xs text-destructive">{errors.password?.message}</p>
                </div>
              </div>
                    {/* Submit */}
              <div className="mt-6 w-full text-left">
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Login..." : "Login"}
                </Button>
              </div>
             <div className="mt-8 flex flex-col">
               <Link href="/doctor/registration" className="text-sm font-medium text-secondary hover:underline mb-4">
              Don't have an account? Sign up
              </Link>
              <Link href="/doctor/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot your password?
              </Link>
             </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}