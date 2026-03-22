"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Stethoscope, MapPin, Search, Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getDoctorsByHospital,
  assignDoctorToHospital,
  unassignDoctorFromHospital,
  HospitalDoctorResponse,
} from "@/actions/hospital/hospitalDoctors";
import { globalSearch } from "@/actions/global.search";
import { SearchResultIteam } from "@/types/search.type";

export default function ManageDoctors({
  hospitalUserId,
  lang,
}: {
  hospitalUserId: number;
  lang: string;
}) {
  const queryClient = useQueryClient();
  const [assignOpen, setAssignOpen] = useState(false);
  const [unassignTarget, setUnassignTarget] = useState<HospitalDoctorResponse | null>(null);

  // Assign form state
  const [doctorSearch, setDoctorSearch] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResultIteam[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<SearchResultIteam | null>(null);
  const [locationId, setLocationId] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fetch assigned doctors
  const { data, isLoading } = useQuery({
    queryKey: ["hospital-doctors", hospitalUserId],
    queryFn: () => getDoctorsByHospital({ lang, hospitalUserId }),
  });
  const doctors: HospitalDoctorResponse[] = data?.payload ?? [];

  // Assign mutation
  const assignMutation = useMutation({
    mutationFn: ({ doctorUserId, hospitalLocationId }: { doctorUserId: number; hospitalLocationId: number }) =>
      assignDoctorToHospital({ lang, hospitalUserId, doctorUserId, hospitalLocationId }),
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Doctor assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["hospital-doctors", hospitalUserId] });
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
      queryClient.invalidateQueries({ queryKey: ["hospital-doctors", hospitalUserId] });
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
    setLocationId("");
  };

  const handleAssignSubmit = () => {
    if (!selectedDoctor) { toast.error("Please select a doctor"); return; }
    if (!locationId || isNaN(Number(locationId))) { toast.error("Please enter a valid location ID"); return; }
    assignMutation.mutate({ doctorUserId: selectedDoctor.userId, hospitalLocationId: Number(locationId) });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${doctors.length} doctor${doctors.length !== 1 ? "s" : ""} assigned`}
        </p>
        <Button size="sm" className="gap-1.5" onClick={() => setAssignOpen(true)}>
          <Plus className="w-4 h-4" />
          Assign Doctor
        </Button>
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
          {doctors.map((doc, i) => (
            <div
              key={doc.id}
              className={`flex items-center gap-4 px-5 py-4 ${i !== doctors.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Stethoscope className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{doc.doctorName}</p>
                {doc.hospitalLocationName && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {doc.hospitalLocationName}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => setUnassignTarget(doc)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={(v) => { if (!v) handleAssignClose(); }}>
        <DialogContent className="max-w-md">
          <DialogTitle>Assign Doctor</DialogTitle>
          <div className="space-y-4 py-2">
            {/* Doctor search */}
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

            {/* Hospital Location ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Hospital Location ID <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                placeholder="Enter hospital location ID"
              />
              <p className="text-xs text-muted-foreground">Location picker coming soon — enter the ID manually for now.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleAssignClose}>Cancel</Button>
            <Button onClick={handleAssignSubmit} disabled={assignMutation.isPending}>
              {assignMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Assigning...</> : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unassign Confirm Dialog */}
      <Dialog open={!!unassignTarget} onOpenChange={(v) => { if (!v) setUnassignTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Remove Doctor</DialogTitle>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to remove <span className="font-semibold text-foreground">{unassignTarget?.doctorName}</span> from your hospital? This will also remove their associated location.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnassignTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => unassignTarget && unassignMutation.mutate(unassignTarget.id)}
              disabled={unassignMutation.isPending}
            >
              {unassignMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Removing...</> : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
