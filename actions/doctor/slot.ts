import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get available slots by doctor user id and date
export const getAvailableSlots = async ({
  doctorUserId,
  doctorLocationId,
  requestedDate,
  lang,
}: {
  doctorUserId: number;
  doctorLocationId: number;
  requestedDate: string;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: `/api/appointments/available-slots/doctor-user/${doctorUserId}/doctor-location/${doctorLocationId}`,
    method: "GET",
    params: {
      requestedDate,
      doctorUserId,
      doctorLocationId,
      lang,
    },
  });

  return res;
};

// Get default time slot
export const getDefaultTimeSlot = async ({ lang }: { lang: string }) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: "/api/doctors/availability/time-slots/default",
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
