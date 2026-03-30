"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import { ArrowLeft, Loader2, Save, ShieldCheck } from "lucide-react";
import {
  getRoleById,
  getRoleTypes,
  getAllPrivileges,
  createRole,
  updateRole,
} from "@/actions/admin/role.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrivilegePicker } from "./PrivilegePicker";
import { RoleTypeBadge } from "./RoleTypeBadge";
import type { Privilege } from "@/types/admin.role.type";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const roleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  roleType: z.string().min(1, "Role type is required"),
  description: z.string().optional(),
});
type RoleFormValues = z.infer<typeof roleSchema>;

interface Props {
  lang: string;
  roleId?: number;
}

export default function RoleFormPage({ lang, roleId }: Props) {
  const isEdit = !!roleId;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPrivilegeIds, setSelectedPrivilegeIds] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoleFormValues>({ resolver: zodResolver(roleSchema) });

  // Fetch role for editing
  const { data: roleData, isLoading: isLoadingRole } = useSafeQuery({
    queryKey: ["admin-role", roleId],
    queryFn: () => getRoleById({ lang, id: roleId! }),
    enabled: isEdit,
  });

  // Fetch role types
  const { data: roleTypesData } = useSafeQuery({
    queryKey: ["admin-role-types"],
    queryFn: () => getRoleTypes({ lang }),
  });

  // Fetch all privileges
  const { data: privilegesData, isLoading: isLoadingPrivileges } = useSafeQuery({
    queryKey: ["admin-privileges"],
    queryFn: () => getAllPrivileges({ lang }),
  });

  const roleTypes: string[] = ((roleTypesData as any)?.data as string[]) ?? [];
  const allPrivileges: Privilege[] = ((privilegesData as any)?.data as Privilege[]) ?? [];

  // Pre-fill form when editing
  useEffect(() => {
    const role = (roleData as any)?.data as any;
    if (!role) return;
    setValue("roleName", role.roleName ?? "");
    setValue("roleType", role.roleType ?? "");
    setValue("description", role.description ?? "");
    setSelectedPrivilegeIds((role.privileges ?? []).map((p: Privilege) => p.id));
  }, [roleData, setValue]);

  const createMutation = useSafeMutation({
    mutationFn: (values: RoleFormValues) =>
      createRole({
        lang,
        body: {
          roleName: values.roleName,
          roleType: values.roleType,
          description: values.description,
          privilegeIds: selectedPrivilegeIds,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role created successfully.");
      router.push(`/${lang}/admin/roles`);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to create role.");
    },
  });

  const updateMutation = useSafeMutation({
    mutationFn: (values: RoleFormValues) =>
      updateRole({
        lang,
        body: {
          id: roleId!,
          roleName: values.roleName,
          roleType: values.roleType,
          description: values.description,
          privilegeIds: selectedPrivilegeIds,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-role", roleId] });
      toast.success("Role updated successfully.");
      router.push(`/${lang}/admin/roles/${roleId}`);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update role.");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: RoleFormValues) => {
    if (isEdit) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isLoadingForm = isEdit && isLoadingRole;

  return (
    <div className="space-y-6 py-6 max-w-3xl">
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
            {isEdit ? "Edit Role" : "New Role"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEdit
              ? "Update role details and privilege assignments."
              : "Create a new role and assign privileges."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Role details card */}
        <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground">Role Details</h2>
          </div>
          <div className="p-6 space-y-5">
            {isLoadingForm ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Role Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="roleName">
                    Role Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="roleName"
                    {...register("roleName")}
                    placeholder="e.g. HOSPITAL_MANAGER"
                    className="uppercase placeholder:normal-case"
                  />
                  {errors.roleName && (
                    <p className="text-xs text-destructive">{errors.roleName.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use uppercase with underscores, e.g. <code className="text-foreground">HOSPITAL_MANAGER</code>
                  </p>
                </div>

                {/* Role Type */}
                <div className="space-y-1.5">
                  <Label>
                    Role Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("roleType") ?? ""}
                    onValueChange={(val) => setValue("roleType", val, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          <div className="flex items-center gap-2">
                            <RoleTypeBadge type={t} />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roleType && (
                    <p className="text-xs text-destructive">{errors.roleType.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe what this role is used for…"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Privileges card */}
        <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Privileges</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedPrivilegeIds.length} selected
                </p>
              </div>
            </div>
            {selectedPrivilegeIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedPrivilegeIds([])}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="p-6">
            {isLoadingPrivileges ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <PrivilegePicker
                allPrivileges={allPrivileges}
                selectedIds={selectedPrivilegeIds}
                onChange={setSelectedPrivilegeIds}
              />
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
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> {isEdit ? "Save Changes" : "Create Role"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
