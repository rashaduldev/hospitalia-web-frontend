"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import {
  getBeneficiaries,
  addBeneficiary,
  deleteBeneficiary,
} from "@/actions/patient/beneficiary.actions";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { Beneficiary } from "@/types/patient.user.type";
import AppButton from "@/components/common/AppButton";
import ErrorDialog from "@/components/common/ErrorDialog";
import { toast } from "sonner";

const RELATION_OPTIONS = [
  "Father",
  "Mother",
  "Spouse",
  "Husband",
  "Wife",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Uncle",
  "Aunt",
  "Nephew",
  "Niece",
  "Other",
];

export default function PatientBeneficiariesPage({
  lang,
  patientUserId,
}: {
  lang: string;
  patientUserId: number | null;
}) {
  const queryClient = useQueryClient();

  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryRelation, setBeneficiaryRelation] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // ── Beneficiaries ──────────────────────────────────────────────────────────
  const {
    data: benefData,
    isLoading: benefLoading,
    isError: benefError,
    isRefetching: benefRefetching,
    error: benefErrorObj,
    refetch: refetchBenef,
  } = useSafeQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => getBeneficiaries({ lang, pageNo: 0, pageSize: 20 }),
  });

  const beneficiaries: Beneficiary[] = benefData?.payload?.content ?? [];

  // ── Mutations ──────────────────────────────────────────────────────────────
  const addBeneficiaryMutation = useSafeMutation({
    mutationFn: ({ name, relation }: { name: string; relation: string }) =>
      addBeneficiary({ patientUserId: patientUserId!, name, relation, lang }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      setBeneficiaryName("");
      setBeneficiaryRelation("");
      setAddError(null);
      toast.success("Beneficiary added successfully");
    },
    onError: (err: Error) => {
      if (err.name === "SessionExpiredError") return;
      setAddError(err.message);
    },
  });

  const deleteBeneficiaryMutation = useSafeMutation({
    mutationFn: (id: number) => deleteBeneficiary({ id, lang }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      setDeleteTargetId(null);
      toast.success("Beneficiary removed");
    },
    onError: (err: Error) => {
      if (err.name === "SessionExpiredError") return;
      setDeleteTargetId(null);
      setErrorDialog(err.message || "Failed to remove beneficiary");
    },
  });

  return (
    <div className="p-6 space-y-6">
      <Typography size="2xl" weight="bold" color="foreground" as="h1">
        Beneficiaries
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Beneficiaries list */}
        <div className="bg-card rounded-lg border p-6">
          <Typography size="xl" weight="semiBold" color="foreground" as="h3" className="mb-4">
            My Beneficiaries
          </Typography>

          {benefError ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="h-7 w-7 text-destructive" />
              <p className="text-sm font-medium text-destructive">
                {(benefErrorObj as Error)?.message || "Failed to load beneficiaries"}
              </p>
              <button
                type="button"
                onClick={() => refetchBenef()}
                disabled={benefRefetching}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${benefRefetching ? "animate-spin" : ""}`} />
                {benefRefetching ? "Retrying…" : "Try again"}
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-semibold text-foreground">Patient Name</th>
                  <th className="py-2 text-left font-semibold text-foreground">Relation</th>
                  <th className="py-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {benefLoading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                    </td>
                  </tr>
                ) : beneficiaries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground text-xs">
                      No beneficiaries added yet
                    </td>
                  </tr>
                ) : (
                  beneficiaries.map((b) => (
                    <tr key={b.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{b.name}</td>
                      <td className="py-3 text-muted-foreground">{b.relation}</td>
                      <td className="py-3 text-right">
                        <AlertDialog
                          open={deleteTargetId === b.id}
                          onOpenChange={(open) => !open && setDeleteTargetId(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              aria-label="Remove beneficiary"
                              onClick={() => setDeleteTargetId(b.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Beneficiary</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{" "}
                                <span className="font-semibold text-foreground">{b.name}</span>{" "}
                                ({b.relation}) from your beneficiaries? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                disabled={deleteBeneficiaryMutation.isPending}
                                onClick={() => setDeleteTargetId(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AppButton
                                variant="destructive"
                                isLoading={deleteBeneficiaryMutation.isPending}
                                loadingText="Removing…"
                                onClick={() => deleteBeneficiaryMutation.mutate(b.id)}
                              >
                                Remove
                              </AppButton>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add a Beneficiary form */}
        <div className="bg-card rounded-lg border p-6 self-start">
          <Typography size="xl" weight="semiBold" color="foreground" as="h3" className="mb-4">
            Add a Beneficiary
          </Typography>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input
                  placeholder="Enter name"
                  value={beneficiaryName}
                  onChange={(e) => {
                    setBeneficiaryName(e.target.value);
                    setAddError(null);
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Relation</label>
                <Select
                  value={beneficiaryRelation}
                  onValueChange={(v) => {
                    setBeneficiaryRelation(v);
                    setAddError(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATION_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {addError && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <div className="flex justify-end">
              <AppButton
                className="bg-secondary text-white hover:bg-secondary/90"
                isLoading={addBeneficiaryMutation.isPending}
                loadingText="Adding..."
                disabled={!patientUserId}
                onClick={() => {
                  if (!beneficiaryName.trim() || !beneficiaryRelation) {
                    setAddError("Please fill in all fields");
                    return;
                  }
                  setAddError(null);
                  addBeneficiaryMutation.mutate({
                    name: beneficiaryName.trim(),
                    relation: beneficiaryRelation,
                  });
                }}
              >
                Confirm
              </AppButton>
            </div>
          </div>
        </div>
      </div>

      <ErrorDialog message={errorDialog} onClose={() => setErrorDialog(null)} />
    </div>
  );
}
