"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import { ArrowLeft, Loader2, Save, User } from "lucide-react";
import {
  getUserById,
  createAdminUser,
  updateAdminUser,
} from "@/actions/admin/users.actions";
import { getPaginatedRoles } from "@/actions/admin/role.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUser } from "@/types/admin.user.type";
import type { Role, PaginatedRoles } from "@/types/admin.role.type";
import { toast } from "sonner";

const baseSchema = {
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleId: z.string().min(1, "Please select a role"),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const editSchema = z.object({
  ...baseSchema,
  password: z.string().optional(),
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;
type FormValues = CreateFormValues | EditFormValues;

interface Props {
  lang: string;
  userId?: number;
}

export default function UserFormPage({ lang, userId }: Props) {
  const isEdit = !!userId;
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
  });

  const { data: userData, isLoading: isLoadingUser } = useSafeQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => getUserById({ lang, id: userId! }),
    enabled: isEdit,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useSafeQuery({
    queryKey: ["admin-roles", 0],
    queryFn: () => getPaginatedRoles({ lang, pageNo: 0, pageSize: 100 }),
  });

  const roles: Role[] = (rolesData?.payload as PaginatedRoles)?.content ?? [];

  useEffect(() => {
    const user = userData?.payload as AdminUser | null;
    if (!user) return;
    setValue("email", user.email ?? "");
    setValue("firstName", user.userDetails?.firstName ?? "");
    setValue("lastName", user.userDetails?.lastName ?? "");
    if (user.roles[0]) {
      setValue("roleId", String(user.roles[0].id));
    }
  }, [userData, setValue]);

  const createMutation = useSafeMutation({
    mutationFn: (values: CreateFormValues) =>
      createAdminUser({
        lang,
        body: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          roleId: Number(values.roleId),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Admin user created successfully.");
      router.push(`/${lang}/admin/users`);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to create user.");
    },
  });

  const updateMutation = useSafeMutation({
    mutationFn: (values: EditFormValues) =>
      updateAdminUser({
        lang,
        body: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password || null,
          roleId: Number(values.roleId),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
      toast.success("User updated successfully.");
      router.push(`/${lang}/admin/users/${userId}`);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update user.");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isLoadingForm = isEdit && isLoadingUser;

  const onSubmit = (values: FormValues) => {
    if (isEdit) {
      updateMutation.mutate(values as EditFormValues);
    } else {
      createMutation.mutate(values as CreateFormValues);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? "Edit Admin User" : "New Admin User"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEdit
              ? "Update admin user details and role assignment."
              : "Create a new admin user and assign a role."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground">User Details</h2>
          </div>

          <div className="p-6 space-y-5">
            {isLoadingForm ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* First + Last name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      placeholder="Jane"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      placeholder="Smith"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="admin@example.com"
                    disabled={isEdit}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                  {isEdit && (
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed after creation.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password">
                    Password{" "}
                    {!isEdit ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-muted-foreground font-normal">
                        (leave blank to keep current)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder={isEdit ? "••••••••" : "Enter password"}
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <Label>
                    Role <span className="text-destructive">*</span>
                  </Label>
                  {isLoadingRoles ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={watch("roleId") ?? ""}
                      onValueChange={(val) =>
                        setValue("roleId", val, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {r.roleName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.roleId && (
                    <p className="text-xs text-destructive">
                      {errors.roleId.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />{" "}
                {isEdit ? "Save Changes" : "Create User"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
