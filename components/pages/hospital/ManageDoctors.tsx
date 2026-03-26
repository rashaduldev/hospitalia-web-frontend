"use client";

import { useState, useRef, useMemo } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Stethoscope, MapPin, Loader2, UserX, ExternalLink, Users, Search, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getDoctorsByHospital,
  assignDoctorToHospital,
  unassignDoctorFromHospital,
  getImportedDoctorsByUser,
  HospitalDoctorResponse,
} from "@/actions/hospital/hospitalDoctors";
import { getHospitalLocations, HospitalLocation } from "@/actions/hospital/hospitalLocations";
import { getDoctorInfoByDoctorId } from "@/actions/doctor/doctordata";
import { globalSearch } from "@/actions/global.search";
import { SearchResultIteam } from "@/types/search.type";
import { SingleDoctorInfo } from "@/types/doctor";

export default function ManageDoctors({
  hospitalId,
  lang,
  userId = hospitalId,
}: {
  hospitalId: number;
  lang: string;
  userId?: number;
}) {
  const queryClient = useQueryClient();
  const [assignOpen, setAssignOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [unassignTarget, setUnassignTarget] = useState<HospitalDoctorResponse | null>(null);

  // Single assign form state
  const [doctorSearch, setDoctorSearch] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResultIteam[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<SearchResultIteam | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fetch hospital locations
  const { data: locationsData } = useQuery({
    queryKey: ["hospital-locations", hospitalId],
    queryFn: () => getHospitalLocations({ lang, hospitalId }),
    enabled: assignOpen || bulkAssignOpen,
  });
  const hospitalLocations: HospitalLocation[] = locationsData?.payload ?? [];

  // Fetch assigned doctors
  const { data, isLoading } = useQuery({
    queryKey: ["hospital-doctors", hospitalId],
    queryFn: () => getDoctorsByHospital({ lang, hospitalId }),
  });
  const doctors: HospitalDoctorResponse[] = data?.payload ?? [];

  // Fetch each doctor's profile in parallel
  const doctorProfileQueries = useQueries({
    queries: doctors.map((doc) => ({
      queryKey: ["doctor-profile", doc.doctorId],
      queryFn: () => getDoctorInfoByDoctorId({ lang, doctorId: doc.doctorId }),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const doctorProfiles = new Map<number, SingleDoctorInfo>();
  doctorProfileQueries.forEach((q, i) => {
    if (q.data?.payload) {
      doctorProfiles.set(doctors[i].doctorId, q.data.payload as SingleDoctorInfo);
    }
  });

  // Assign mutation
  const assignMutation = useMutation({
    mutationFn: ({ doctorId, hospitalLocationId }: { doctorId: number; hospitalLocationId: number }) =>
      assignDoctorToHospital({ lang, hospitalId, doctorId, hospitalLocationId }),
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Doctor assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["hospital-doctors", hospitalId] });
      handleAssignClose();
    },
    onError: () => toast.error("Failed to assign doctor"),
  });

  // Unassign mutation
  const unassignMutation = useMutation({
    mutationFn: (id: number) => unassignDoctorFromHospital({ lang, id }),
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Doctor removed successfully");
      queryClient.invalidateQueries({ queryKey: ["hospital-doctors", hospitalId] });
      setUnassignTarget(null);
    },
    onError: () => toast.error("Failed to remove doctor"),
  });

  const handleDoctorSearch = (keyword: string) => {
    setDoctorSearch(keyword);
    setSelectedDoctor(null);
    if (keyword.length < 2) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await globalSearch({ lang, searchType: "DOCTOR", searchKeyword: keyword });
        setSuggestions(res?.payload?.content?.slice(0, 5) ?? []);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleAssignClose = () => {
    setAssignOpen(false);
    setDoctorSearch("");
    setSuggestions([]);
    setSelectedDoctor(null);
    setSelectedLocationId("");
  };

  const handleAssignSubmit = () => {
    if (!selectedDoctor) { toast.error("Please select a doctor"); return; }
    if (!selectedLocationId) { toast.error("Please select a location"); return; }
    assignMutation.mutate({ doctorId: selectedDoctor.doctorId!, hospitalLocationId: Number(selectedLocationId) });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${doctors.length} doctor${doctors.length !== 1 ? "s" : ""} assigned`}
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setBulkAssignOpen(true)}>
            <Users className="w-4 h-4" />
            Assign Multiple Doctors
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setAssignOpen(true)}>
            <Plus className="w-4 h-4" />
            Assign Doctor
          </Button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <UserX className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No doctors assigned yet</p>
          <p className="text-xs text-muted-foreground">Assign doctors to your hospital to get started.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          {doctors.map((doc, i) => {
            const profile = doctorProfiles.get(doc.doctorId);
            const name = profile
              ? `${profile.firstName} ${profile.lastName}`.trim()
              : (doc.doctorName || `Doctor #${doc.doctorId}`);
            const designation = profile?.professionalInfoResponse?.designation;
            const specialities = profile?.professionalInfoResponse?.specialities?.slice(0, 2) ?? [];

            return (
              <div
                key={doc.id}
                className={`flex items-center gap-4 px-5 py-4 ${i !== doctors.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                  <Stethoscope className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/doctor/${doc.doctorId}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {name}
                  </Link>
                  {designation && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{designation}</p>
                  )}
                  {specialities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {specialities.map((s) => (
                        <Badge key={s.id} variant="outline" className="text-xs px-1.5 py-0 h-4">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {doc.hospitalLocationName && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {doc.hospitalLocationName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                    <Link href={`/doctor/${doc.doctorId}`}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setUnassignTarget(doc)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Assign Dialog */}
      <AlertDialog open={assignOpen} onOpenChange={(v) => { if (!v) handleAssignClose(); }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Doctor</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Search Doctor <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  value={selectedDoctor ? selectedDoctor.name : doctorSearch}
                  onChange={(e) => handleDoctorSearch(e.target.value)}
                  placeholder="Type doctor name or specialty..."
                  className="pr-8"
                  readOnly={!!selectedDoctor}
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                )}
                {selectedDoctor && (
                  <button
                    type="button"
                    onClick={() => { setSelectedDoctor(null); setDoctorSearch(""); setSuggestions([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>
              {suggestions.length > 0 && !selectedDoctor && (
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                  {suggestions.map((s) => (
                    <button
                      key={s.userId}
                      type="button"
                      onClick={() => { setSelectedDoctor(s); setSuggestions([]); }}
                      className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors border-b border-border last:border-0"
                    >
                      <Stethoscope className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                        {s.designation && (
                          <p className="text-xs text-muted-foreground truncate">{s.designation}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Hospital Location <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a location...</option>
                {hospitalLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locationName}{loc.city ? ` — ${loc.city}` : ""}
                  </option>
                ))}
              </select>
              {hospitalLocations.length === 0 && (
                <p className="text-xs text-destructive">No locations found. Add a location first from the Locations tab.</p>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAssignClose}>Cancel</AlertDialogCancel>
            <Button onClick={handleAssignSubmit} disabled={assignMutation.isPending}>
              {assignMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Assigning...</> : "Assign"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Assign Dialog */}
      {bulkAssignOpen && (
        <BulkAssignDialog
          open={bulkAssignOpen}
          onClose={() => setBulkAssignOpen(false)}
          lang={lang}
          userId={userId}
          hospitalId={hospitalId}
          hospitalLocations={hospitalLocations}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["hospital-doctors", hospitalId] })}
        />
      )}

      {/* Unassign Confirm Dialog */}
      <AlertDialog open={!!unassignTarget} onOpenChange={(v) => { if (!v) setUnassignTarget(null); }}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Doctor</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              {unassignTarget ? (doctorProfiles.get(unassignTarget.doctorId)
                ? `${doctorProfiles.get(unassignTarget.doctorId)!.firstName} ${doctorProfiles.get(unassignTarget.doctorId)!.lastName}`
                : unassignTarget.doctorName) : ""}
            </span>{" "}
            from this hospital?
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUnassignTarget(null)}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => unassignTarget && unassignMutation.mutate(unassignTarget.id)}
              disabled={unassignMutation.isPending}
            >
              {unassignMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Removing...</> : "Remove"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BulkAssignDialog({
  open,
  onClose,
  lang,
  userId,
  hospitalId,
  hospitalLocations,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  lang: string;
  userId: number;
  hospitalId: number;
  hospitalLocations: HospitalLocation[];
  onSuccess: () => void;
}) {
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [locationId, setLocationId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["imported-doctors", userId],
    queryFn: () => getImportedDoctorsByUser({ lang, userId }),
  });
  const importedDoctors: SingleDoctorInfo[] = data?.payload?.content ?? [];

  const filtered = useMemo(() => {
    if (!filter.trim()) return importedDoctors;
    const q = filter.toLowerCase();
    return importedDoctors.filter((d) => {
      const name = `${d.firstName} ${d.lastName}`.toLowerCase();
      const designation = d.professionalInfoResponse?.designation?.toLowerCase() ?? "";
      return name.includes(q) || designation.includes(q);
    });
  }, [importedDoctors, filter]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((d) => selectedIds.has(d.id!));

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((d) => next.delete(d.id!));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((d) => { if (d.id) next.add(d.id); });
        return next;
      });
    }
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleClose = () => {
    if (submitting) return;
    setFilter("");
    setSelectedIds(new Set());
    setLocationId("");
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedIds.size === 0) { toast.error("Select at least one doctor."); return; }
    if (!locationId) { toast.error("Please select a hospital location."); return; }
    setSubmitting(true);
    let succeeded = 0;
    let failed = 0;
    const hospitalLocationId = Number(locationId);
    await Promise.allSettled(
      Array.from(selectedIds).map(async (doctorId) => {
        try {
          const res = await assignDoctorToHospital({ lang, hospitalId, doctorId, hospitalLocationId });
          if (res.success) succeeded++; else failed++;
        } catch {
          failed++;
        }
      }),
    );
    setSubmitting(false);
    if (succeeded > 0) {
      toast.success(`${succeeded} doctor${succeeded !== 1 ? "s" : ""} assigned successfully${failed > 0 ? `, ${failed} failed` : ""}`);
      onSuccess();
      handleClose();
    } else {
      toast.error("All assignments failed. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Assign Multiple Doctors
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4 py-1">
          {/* Location selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Hospital Location <span className="text-destructive">*</span>
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              disabled={submitting}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            >
              <option value="">Select a location...</option>
              {hospitalLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.locationName}{loc.city ? ` — ${loc.city}` : ""}
                </option>
              ))}
            </select>
            {hospitalLocations.length === 0 && (
              <p className="text-xs text-destructive">No locations found. Add a location first from the Locations tab.</p>
            )}
          </div>

          {/* Search filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter doctors by name or designation..."
              className="pl-9"
              disabled={submitting}
            />
          </div>

          {/* Doctor list */}
          <div className="border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <UserX className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {importedDoctors.length === 0 ? "No imported doctors found." : "No doctors match your filter."}
                </p>
              </div>
            ) : (
              <>
                {/* Select all row */}
                <button
                  type="button"
                  onClick={toggleAll}
                  disabled={submitting}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-muted/40 border-b border-border hover:bg-muted/70 transition-colors text-left disabled:opacity-60"
                >
                  {allFilteredSelected
                    ? <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                    : <Square className="w-4 h-4 text-muted-foreground shrink-0" />}
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {allFilteredSelected ? "Deselect all" : `Select all (${filtered.length})`}
                  </span>
                </button>

                {filtered.map((doctor) => {
                  const id = doctor.id!;
                  const isSelected = selectedIds.has(id);
                  const name = `${doctor.firstName} ${doctor.lastName}`.trim();
                  const designation = doctor.professionalInfoResponse?.designation;
                  const specialities = doctor.professionalInfoResponse?.specialities?.slice(0, 2) ?? [];

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleOne(id)}
                      disabled={submitting}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-0 transition-colors disabled:opacity-60 ${
                        isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40"
                      }`}
                    >
                      {isSelected
                        ? <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                        : <Square className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Dr. {name}</p>
                        {designation && (
                          <p className="text-xs text-muted-foreground truncate">{designation}</p>
                        )}
                        {specialities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {specialities.map((s) => (
                              <Badge key={s.id} variant="outline" className="text-xs px-1.5 py-0 h-4">
                                {s.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {selectedIds.size > 0 && (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{selectedIds.size}</span> doctor{selectedIds.size !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={submitting}>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={submitting || selectedIds.size === 0} className="min-w-28 gap-2">
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Assigning...</>
            ) : (
              <>Assign {selectedIds.size > 0 ? selectedIds.size : ""} Doctor{selectedIds.size !== 1 ? "s" : ""}</>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
