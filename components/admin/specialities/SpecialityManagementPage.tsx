"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Pencil,
  Trash2,
  Save,
  X,
  Plus,
  Stethoscope,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";
import {
  getAllSpecialities,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
} from "@/actions/admin/speciality.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Speciality } from "@/types/speciality.type";

const nameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});
type NameValues = z.infer<typeof nameSchema>;

export default function SpecialityManagementPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Speciality | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── Create form ──
  const {
    register,
    handleSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<NameValues>({ resolver: zodResolver(nameSchema) });

  // ── Fetch all, sorted alphabetically by the API ──
  const { data, isLoading } = useQuery({
    queryKey: ["admin-specialities"],
    queryFn: () =>
      getAllSpecialities({ pageNo: 0, pageSize: 1000 }),
  });

  const allSpecialities: Speciality[] = data?.payload?.content ?? [];
  const total = allSpecialities.length;

  // ── Client-side sort + search filter ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...allSpecialities].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    if (!q) return sorted;
    return sorted.filter((s) => s.name.toLowerCase().includes(q));
  }, [allSpecialities, search]);

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ── Create ──
  const createMutation = useMutation({
    mutationFn: (values: NameValues) => createSpeciality({ name: values.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specialities"] });
      resetCreate();
      flash("Speciality created successfully.");
    },
  });

  // ── Update ──
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateSpeciality({ id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specialities"] });
      setEditingId(null);
      flash("Speciality updated successfully.");
    },
  });

  // ── Delete ──
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSpeciality({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specialities"] });
      setDeleteTarget(null);
      flash("Speciality deleted.");
    },
  });

  const startEdit = (item: Speciality) => {
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const saveEdit = () => {
    if (!editingId || !editValue.trim()) return;
    updateMutation.mutate({ id: editingId, name: editValue.trim() });
  };

  return (
    <div className="space-y-6 py-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Speciality Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage doctor specialities available on the platform.
        </p>
      </div>

      {/* ── Success flash ── */}
      {successMsg && (
        <div className="flex items-center gap-2 text-sm text-secondary font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* ── Create card ── */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Plus className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">
              Add New Speciality
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enter a speciality name to add it to the platform.
            </p>
          </div>
        </div>
        <div className="p-6">
          <form
            onSubmit={handleSubmit((v) => createMutation.mutate(v))}
            className="flex items-start gap-3 max-w-md"
          >
            <div className="flex-1">
              <Input
                {...register("name")}
                placeholder="e.g. Neurology"
                className="h-10"
              />
              {createErrors.name && (
                <p className="text-xs text-destructive mt-1">
                  {createErrors.name.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="h-10 gap-2 shrink-0"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add
            </Button>
          </form>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        {/* Card header: title + search */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Stethoscope className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-none">
                All Specialities
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading
                  ? "Loading…"
                  : search
                  ? `${filtered.length} of ${total} specialit${total === 1 ? "y" : "ies"}`
                  : `${total} specialit${total === 1 ? "y" : "ies"} · sorted A–Z`}
              </p>
            </div>
          </div>

          {/* Search input */}
          <div className="relative w-full max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search specialities…"
              className="pl-9 h-9 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-muted/50 rounded-full mb-3">
                <Search className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {search ? `No results for "${search}"` : "No specialities found"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filtered.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors"
              >
                {/* Row number + name */}
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                  <span className="text-xs text-muted-foreground/60 w-6 shrink-0 tabular-nums">
                    {index + 1}
                  </span>
                  {editingId === item.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 max-w-xs text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                  ) : (
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {editingId === item.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                        disabled={updateMutation.isPending}
                        onClick={saveEdit}
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Delete dialog ── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-destructive/10 shrink-0">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Delete Speciality
              </DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              ? This cannot be undone.
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
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
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
