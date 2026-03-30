"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import {
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Download,
  ShieldCheck,
  Search,
  X,
} from "lucide-react";
import type { Value as PhoneValue } from "react-phone-number-input";
import { getPaginatedUsers, deleteAdminUser } from "@/actions/admin/users.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserTypeBadge } from "./UserTypeBadge";
import type { AdminUser, PaginatedUsers } from "@/types/admin.user.type";
import { toast } from "sonner";

const USER_TYPE_OPTIONS = [
  { value: "ALL", label: "All Types" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "PATIENT", label: "Patient" },
  { value: "HOSPITAL", label: "Hospital" },
];

const PAGE_SIZE = 20;

function getFullName(user: AdminUser): string {
  const d = user.userDetails;
  if (!d) return "—";
  return [d.firstName, d.lastName].filter(Boolean).join(" ") || "—";
}

interface UsersPageProps {
  lang: string;
  /** URL segment used for navigation, e.g. "/admin/admins". Defaults to "/admin/users". */
  basePath?: string;
  /** When set the type filter is locked to this value and the selector is hidden. */
  fixedUserType?: string;
  title?: string;
  description?: string;
}

export default function UsersPage({
  lang,
  basePath = "/admin/users",
  fixedUserType,
  title = "User Management",
  description = "View and manage all platform users.",
}: UsersPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter raw inputs
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState<PhoneValue | undefined>(undefined);
  const [userTypeFilter, setUserTypeFilter] = useState(fixedUserType ?? "ALL");

  // Debounced committed values for the query
  const [nameQuery, setNameQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const nameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNameChange = (val: string) => {
    setNameInput(val);
    if (nameTimer.current) clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(() => {
      setNameQuery(val.trim());
      setPage(0);
    }, 400);
  };

  const handlePhoneChange = (val: PhoneValue | undefined) => {
    setPhoneInput(val);
    if (phoneTimer.current) clearTimeout(phoneTimer.current);
    phoneTimer.current = setTimeout(() => {
      setPhoneQuery((val ?? "").trim());
      setPage(0);
    }, 400);
  };

  const handleTypeChange = (val: string) => {
    setUserTypeFilter(val);
    setPage(0);
  };

  const defaultType = fixedUserType ?? "ALL";
  const hasActiveFilters =
    nameInput !== "" || !!phoneInput || userTypeFilter !== defaultType;

  const clearFilters = () => {
    setNameInput("");
    setPhoneInput(undefined);
    setUserTypeFilter(defaultType);
    setNameQuery("");
    setPhoneQuery("");
    setPage(0);
  };

  useEffect(() => {
    return () => {
      if (nameTimer.current) clearTimeout(nameTimer.current);
      if (phoneTimer.current) clearTimeout(phoneTimer.current);
    };
  }, []);

  const activeUserType = userTypeFilter === "ALL" ? undefined : userTypeFilter;

  const { data, isLoading } = useSafeQuery({
    queryKey: ["admin-users", page, nameQuery, phoneQuery, userTypeFilter],
    queryFn: () =>
      getPaginatedUsers({
        lang,
        pageNo: page,
        pageSize: PAGE_SIZE,
        name: nameQuery || undefined,
        mobileNumber: phoneQuery || undefined,
        userType: activeUserType,
      }),
  });

  const paginatedData = data?.payload as PaginatedUsers | undefined;
  const users: AdminUser[] = paginatedData?.content ?? [];
  const totalPages: number = paginatedData?.totalPages ?? 1;
  const totalElements: number = paginatedData?.totalElements ?? 0;

  const deleteMutation = useSafeMutation({
    mutationFn: (email: string) => deleteAdminUser({ lang, email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteTarget(null);
      toast.success("User deleted successfully.");
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to delete user.");
    },
  });

  const handleExport = async (exportType: "EXCEL" | "CSV") => {
    setIsExporting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/export`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exportType, exportAll: true, roleType: "USER" }),
        },
      );
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users.${exportType === "EXCEL" ? "xlsx" : "csv"}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            className="gap-2"
            disabled={isExporting}
            onClick={() => handleExport("EXCEL")}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={nameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Search by name…"
              className="pl-9 h-9 text-sm w-52"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Phone</Label>
          <PhoneInput
            value={phoneInput}
            onChange={handlePhoneChange}
            defaultCountry="SN"
            placeholder="Enter phone number"
            className="h-9 text-sm w-64 [&_button]:h-9 [&_input]:h-9"
          />
        </div>

        {!fixedUserType && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">User Type</Label>
            <Select value={userTypeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-muted-foreground hover:text-foreground mb-0"
            onClick={clearFilters}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table card */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">All Users</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading
                ? "Loading…"
                : `${totalElements} user${totalElements !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-6 py-3 w-16">
                  ID
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Name / Email
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Phone
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Roles
                </th>
                <th className="px-6 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-8" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-44" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-muted-foreground text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => router.push(`/${lang}${basePath}/${user.id}`)}
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground tabular-nums">
                      {user.id}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground leading-none">
                        {getFullName(user)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <UserTypeBadge type={user.userType} />
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground tabular-nums">
                      {user.mobileNumber ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <UserStatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4">
                      {user.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.roles.slice(0, 2).map((r) => (
                            <span
                              key={r.id}
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                            >
                              <ShieldCheck className="w-2.5 h-2.5" />
                              {r.roleName}
                            </span>
                          ))}
                          {user.roles.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{user.roles.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs italic">—</span>
                      )}
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
                          onClick={() =>
                            router.push(`/${lang}${basePath}/${user.id}`)
                          }
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(user)}
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
              <DialogTitle className="text-base font-semibold">Delete User</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget
                  ? getFullName(deleteTarget) !== "—"
                    ? getFullName(deleteTarget)
                    : deleteTarget.email
                  : ""}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.email)
              }
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting…
                </>
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
