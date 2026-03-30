"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
} from "lucide-react";
import { getPaginatedRoles, deleteRole } from "@/actions/admin/role.actions";
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
import { RoleTypeBadge } from "./RoleTypeBadge";
import type { Role, PaginatedRoles } from "@/types/admin.role.type";
import { toast } from "sonner";

const PAGE_SIZE = 20;

export default function RolesPage({ lang }: { lang: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const { data, isLoading } = useSafeQuery({
    queryKey: ["admin-roles", page],
    queryFn: () => getPaginatedRoles({ lang, pageNo: page, pageSize: PAGE_SIZE }),
  });

  const paginatedData = data?.payload as PaginatedRoles | undefined;
  const roles: Role[] = paginatedData?.content ?? [];
  const totalPages: number = paginatedData?.totalPages ?? 1;
  const totalElements: number = paginatedData?.totalElements ?? 0;

  const deleteMutation = useSafeMutation({
    mutationFn: (id: number) => deleteRole({ lang, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      setDeleteTarget(null);
      toast.success("Role deleted successfully.");
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to delete role. It may still be assigned to users.");
    },
  });

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage roles and their privilege assignments.
          </p>
        </div>
        <Button
          onClick={() => router.push(`/${lang}/admin/roles/new`)}
          className="gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Role
        </Button>
      </div>

      {/* Table card */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">All Roles</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading…" : `${totalElements} role${totalElements !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-6 py-3 w-16">
                  ID
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Role Name
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Privileges
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Description
                </th>
                <th className="px-6 py-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-8" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                    No roles found.
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => router.push(`/${lang}/admin/roles/${role.id}`)}
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground tabular-nums">
                      {role.id}
                    </td>
                    <td className="px-4 py-4 font-semibold text-foreground">
                      {role.roleName}
                    </td>
                    <td className="px-4 py-4">
                      <RoleTypeBadge type={role.roleType} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {role.privileges.length}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {role.description ?? <span className="text-muted-foreground/40 italic">—</span>}
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => router.push(`/${lang}/admin/roles/${role.id}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => router.push(`/${lang}/admin/roles/${role.id}/edit`)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(role)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
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
              <span className="font-medium text-foreground">{deleteTarget?.roleName}</span>?
              This will remove it from all assigned users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
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
