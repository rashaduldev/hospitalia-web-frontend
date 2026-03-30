"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ShieldCheck,
  Loader2,
  Save,
} from "lucide-react";
import {
  getRoleById,
  getAllPrivileges,
  updateRole,
  deleteRole,
} from "@/actions/admin/role.actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RoleTypeBadge } from "./RoleTypeBadge";
import { PrivilegePicker } from "./PrivilegePicker";
import type { Privilege, Role } from "@/types/admin.role.type";
import { toast } from "sonner";

interface Props {
  lang: string;
  roleId: number;
}

export default function RoleDetailPage({ lang, roleId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPrivilegeIds, setSelectedPrivilegeIds] = useState<number[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { data: roleData, isLoading: isLoadingRole } = useSafeQuery({
    queryKey: ["admin-role", roleId],
    queryFn: () => getRoleById({ lang, id: roleId }),
  });

  const { data: privilegesData, isLoading: isLoadingPrivileges } = useSafeQuery({
    queryKey: ["admin-privileges"],
    queryFn: () => getAllPrivileges({ lang }),
  });

  const role = (roleData as any)?.data as Role | null;
  const allPrivileges: Privilege[] = ((privilegesData as any)?.data as Privilege[]) ?? [];

  // Seed privilege selection from fetched role
  useEffect(() => {
    if (!role) return;
    setSelectedPrivilegeIds(role.privileges.map((p) => p.id));
    setIsDirty(false);
  }, [role]);

  const handlePrivilegeChange = (ids: number[]) => {
    setSelectedPrivilegeIds(ids);
    setIsDirty(true);
  };

  const updateMutation = useSafeMutation({
    mutationFn: () =>
      updateRole({
        lang,
        body: {
          id: roleId,
          roleName: role!.roleName,
          roleType: role!.roleType,
          description: role!.description ?? undefined,
          privilegeIds: selectedPrivilegeIds,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-role", roleId] });
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      setIsDirty(false);
      toast.success("Privileges updated successfully.");
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update privileges.");
    },
  });

  const deleteMutation = useSafeMutation({
    mutationFn: () => deleteRole({ lang, id: roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role deleted.");
      router.push(`/${lang}/admin/roles`);
    },
    onError: (err: any) => {
      setShowDelete(false);
      toast.error(err?.message ?? "Failed to delete role. It may still be assigned to users.");
    },
  });

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.push(`/${lang}/admin/roles`)}
          className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-muted transition-colors shrink-0 mt-1"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          {isLoadingRole ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{role?.roleName}</h1>
                {role && <RoleTypeBadge type={role.roleType} />}
              </div>
              {role?.description && (
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              )}
            </>
          )}
        </div>
        {!isLoadingRole && role && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => router.push(`/${lang}/admin/roles/${roleId}/edit`)}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Stats row */}
      {!isLoadingRole && role && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="border border-border rounded-xl bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground">Role ID</p>
            <p className="text-lg font-bold text-foreground mt-0.5">#{role.id}</p>
          </div>
          <div className="border border-border rounded-xl bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground">Assigned Privileges</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{role.privileges.length}</p>
          </div>
          <div className="border border-border rounded-xl bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground">Total Available</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{allPrivileges.length}</p>
          </div>
        </div>
      )}

      <Separator />

      {/* Privilege Assignment */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Privilege Assignment</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedPrivilegeIds.length} of {allPrivileges.length} selected
                {isDirty && (
                  <span className="ml-2 text-amber-500 font-medium">· Unsaved changes</span>
                )}
              </p>
            </div>
          </div>
          {isDirty && (
            <Button
              size="sm"
              className="gap-2 shrink-0"
              disabled={updateMutation.isPending}
              onClick={() => updateMutation.mutate()}
            >
              {updateMutation.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</>
              ) : (
                <><Save className="w-3.5 h-3.5" />Save Changes</>
              )}
            </Button>
          )}
        </div>
        <div className="p-6">
          {isLoadingRole || isLoadingPrivileges ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <PrivilegePicker
              allPrivileges={allPrivileges}
              selectedIds={selectedPrivilegeIds}
              onChange={handlePrivilegeChange}
            />
          )}
        </div>

        {/* Sticky save footer when dirty */}
        {isDirty && (
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              You have unsaved privilege changes.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedPrivilegeIds(role?.privileges.map((p) => p.id) ?? []);
                  setIsDirty(false);
                }}
              >
                Discard
              </Button>
              <Button
                size="sm"
                className="gap-2"
                disabled={updateMutation.isPending}
                onClick={() => updateMutation.mutate()}
              >
                {updateMutation.isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</>
                ) : (
                  <><Save className="w-3.5 h-3.5" />Save Changes</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-destructive/10 shrink-0">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <DialogTitle className="text-base font-semibold">Delete Role</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{role?.roleName}</span>?
              This will remove it from all assigned users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting…</>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
