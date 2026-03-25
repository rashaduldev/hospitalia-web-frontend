import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import {
  getDoctorLocations,
  createDoctorLocation,
  updateDoctorLocation,
  deleteDoctorLocation,
} from "@/actions/doctor/location";
import {
  DoctorLocation,
  DoctorUnavailability,
} from "@/types/doctor.location.type";

export function useLocations({
  lang,
  doctorId,
}: {
  lang: string;
  doctorId: number | undefined;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["doctor-locations", doctorId];

  const query = useSafeQuery({
    queryKey,
    queryFn: () => getDoctorLocations({ lang, doctorId: doctorId! }),
    staleTime: 1000 * 60 * 5,
    enabled: !!doctorId,
  });

  // 2. Create/Update Mutation with Optimistic Updates
  const saveMutation = useSafeMutation({
    mutationFn: (payload: DoctorLocation) => {
      return payload.locationId
        ? updateDoctorLocation({
            lang,
            locationId: payload.locationId,
            doctorId: doctorId!,
            locationName: payload.locationName,
            addressLine1: payload.addressLine1,
            city: payload.city,
            postalCode: payload.postalCode,
          })
        : createDoctorLocation({
            lang,
            doctorId: doctorId!,
            locationName: payload.locationName,
            addressLine1: payload.addressLine1,
            city: payload.city,
            postalCode: payload.postalCode,
          });
    },
    onMutate: async (newLocation) => {
      await queryClient.cancelQueries({ queryKey });
      const previousLocations = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: DoctorUnavailability[] = []) => {
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
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousLocations);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  // 3. Delete Mutation
  const deleteMutation = useSafeMutation({
    mutationFn: (locationId: number) =>
      deleteDoctorLocation({ lang, locationId, doctorId: doctorId! }),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousLocations = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: DoctorUnavailability[] = []) =>
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
    locations: query.data?.payload ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveMutation,
    deleteMutation,
  };
}
