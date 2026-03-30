"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  User,
  Shield,
  Activity,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import {
  getUserById,
  updateUserStatus,
  deleteAdminUser,
} from "@/actions/admin/users.actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserTypeBadge } from "./UserTypeBadge";
import type { AdminUser } from "@/types/admin.user.type";
import { USER_STATUSES } from "@/types/admin.user.type";
import { toast } from "sonner";

interface Props {
  lang: string;
  userId: number;
  /** URL segment used for back/edit navigation, e.g. "/admin/admins". Defaults to "/admin/users". */
  basePath?: string;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

export default function UserDetailPage({ lang, userId, basePath = "/admin/users" }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusDescription, setStatusDescription] = useState("");

  const { data: userData, isLoading } = useSafeQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => getUserById({ lang, id: userId }),
  });

  const user = userData?.payload as AdminUser | null;
  const isAdminUser =
    user?.userType === "ADMIN" || user?.userType === "SUPER_ADMIN";

  const getFullName = () => {
    const d = user?.userDetails;
    if (!d) return user?.email ?? "—";
    return (
      [d.firstName, d.lastName].filter(Boolean).join(" ") || user?.email || "—"
    );
  };

  const openStatusDialog = () => {
    setSelectedStatus(user?.status ?? "");
    setStatusDescription(user?.statusDescription ?? "");
    setShowStatusDialog(true);
  };

  const statusMutation = useSafeMutation({
    mutationFn: () =>
      updateUserStatus({
        lang,
        body: {
          userId,
          status: selectedStatus,
          statusDescription: statusDescription || undefined,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setShowStatusDialog(false);
      setSelectedStatus("");
      setStatusDescription("");
      toast.success("User status updated.");
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update status.");
    },
  });

  const deleteMutation = useSafeMutation({
    mutationFn: () => deleteAdminUser({ lang, email: user!.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted.");
      router.push(`/${lang}${basePath}`);
    },
    onError: (err: any) => {
      setShowDeleteDialog(false);
      toast.error(err?.message ?? "Failed to delete user.");
    },
  });

  return (
    <div className="space-y-6 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.push(`/${lang}${basePath}`)}
          className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-muted transition-colors shrink-0 mt-1"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {getFullName()}
                </h1>
                {user && <UserTypeBadge type={user.userType} />}
                {user && <UserStatusBadge status={user.status} />}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </>
          )}
        </div>
        {!isLoading && user && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={openStatusDialog}
            >
              <Activity className="w-3.5 h-3.5" />
              Status
            </Button>
            {isAdminUser && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() =>
                  router.push(`/${lang}${basePath}/${userId}/edit`)
                }
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Stats row */}
      {!isLoading && user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-border rounded-xl bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground">User ID</p>
            <p className="text-lg font-bold text-foreground mt-0.5">#{user.id}</p>
          </div>
          <div className="border border-border rounded-xl bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground">Verified</p>
            <p className="text-lg font-bold mt-0.5">
              {user.isVerified ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-muted-foreground">No</span>
              )}
            </p>
          </div>
          <div className="border border-border rounded-xl bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground">Onboarding</p>
            <p className="text-sm font-semibold text-foreground mt-1 leading-none">
              {user.onboardingStatus?.replace(/_/g, " ") ?? "—"}
            </p>
          </div>
          <div className="border border-border rounded-xl bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground">Roles</p>
            <p className="text-lg font-bold text-foreground mt-0.5">
              {user.roles.length}
            </p>
          </div>
        </div>
      )}

      <Separator />

      {/* Detail cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="border border-border rounded-xl bg-card shadow-sm p-6 space-y-4"
            >
              {[...Array(5)].map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Personal Info */}
            <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  Personal Info
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <InfoRow
                  label="First Name"
                  value={user.userDetails?.firstName}
                />
                <InfoRow
                  label="Last Name"
                  value={user.userDetails?.lastName}
                />
                <InfoRow
                  label="Date of Birth"
                  value={user.userDetails?.dateOfBirth}
                />
                <InfoRow label="Gender" value={user.userDetails?.gender} />
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground break-all">
                      {user.email}
                    </span>
                    {user.contactInfo?.isEmailVerified ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Mobile</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {user.mobileNumber ?? "—"}
                    </span>
                    {user.mobileNumber &&
                      (user.contactInfo?.isMobileNumberVerified ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Roles */}
            <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  Account & Roles
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    User Type
                  </p>
                  <UserTypeBadge type={user.userType} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <UserStatusBadge status={user.status} />
                  {user.statusDescription && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.statusDescription}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Roles</p>
                  {user.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.map((r) => (
                        <span
                          key={r.id}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-foreground px-2 py-1 rounded-md"
                        >
                          <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                          {r.roleName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No roles assigned
                    </span>
                  )}
                </div>
                <InfoRow
                  label="Onboarding Status"
                  value={user.onboardingStatus?.replace(/_/g, " ")}
                />
                {user.onboardingStatusDescription && (
                  <InfoRow
                    label="Onboarding Note"
                    value={user.onboardingStatusDescription}
                  />
                )}
              </div>
            </div>
          </div>
        )
      )}

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Update Status
              </DialogTitle>
            </div>
            <DialogDescription>
              Change the account status for{" "}
              <span className="font-medium text-foreground">
                {getFullName()}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {USER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                value={statusDescription}
                onChange={(e) => setStatusDescription(e.target.value)}
                placeholder="Reason for status change…"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedStatus || statusMutation.isPending}
              onClick={() => statusMutation.mutate()}
            >
              {statusMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-destructive/10 shrink-0">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Delete User
              </DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-foreground">
                {getFullName()}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
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
