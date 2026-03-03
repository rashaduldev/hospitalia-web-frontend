import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorLocations,
  createDoctorLocation,
  updateDoctorLocation,
  deleteDoctorLocation,
} from "@/actions/doctor/location";

export function useLocations({
  doctorUserId,
  lang,
}: {
  doctorUserId: number;
  lang: string;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["locations", doctorUserId],
    queryFn: () =>
      getDoctorLocations({ doctorUserId, lang }).then(
        (res) => res.payload || [],
      ),
  });

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      payload.locationId
        ? updateDoctorLocation(payload)
        : createDoctorLocation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      deleteDoctorLocation({ locationId: id, doctorUserId, lang }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });

  return { ...query, mutation, deleteMutation };
}
