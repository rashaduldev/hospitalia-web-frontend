import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorLocations,
  createDoctorLocation,
  updateDoctorLocation,
  deleteDoctorLocation,
} from "@/actions/doctor/location";

export function useLocations({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["locations", doctorUserId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getDoctorLocations({ lang, doctorUserId });
      if (res.error) throw new Error(res.error);
      return res.payload || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // 2. Create/Update Mutation with Optimistic Updates
  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      payload.locationId
        ? updateDoctorLocation(payload)
        : createDoctorLocation(payload),
    onMutate: async (newLocation) => {
      await queryClient.cancelQueries({ queryKey });
      const previousLocations = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any[] = []) => {
        if (newLocation.locationId) {
          return old.map((loc) =>
            loc.id === newLocation.locationId
              ? { ...loc, ...newLocation }
              : loc,
          );
        }
        return [...old, { ...newLocation, id: Math.random() }];
      });

      return { previousLocations };
    },
    onError: (_, context) => {
      queryClient.setQueryData(queryKey, context?.previousLocations);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (locationId: number) =>
      deleteDoctorLocation({ lang, locationId, doctorUserId }),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousLocations = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any[] = []) =>
        old.filter((loc) => loc.id !== deletedId),
      );

      return { previousLocations };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousLocations);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    locations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveMutation,
    deleteMutation,
  };
}
