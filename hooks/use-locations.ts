import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorLocations, createDoctorLocation, updateDoctorLocation, deleteDoctorLocation } from "@/actions/doctor/location";

export function useLocations(doctorUserId: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["locations", doctorUserId],
    queryFn: () => getDoctorLocations({ doctorUserId }).then(res => res.payload || []),
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => payload.locationId ? updateDoctorLocation(payload) : createDoctorLocation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDoctorLocation(id, doctorUserId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });

  return { ...query, mutation, deleteMutation };
}