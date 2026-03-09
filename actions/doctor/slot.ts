import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get available slots by doctor user id and date
export const getAvailableSlots = async ({
  doctorUserId,
  requestedDate,
  lang,
}: {
  doctorUserId: number;
  requestedDate: string;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: `/api/appointments/available-slots/doctorUserId/${doctorUserId}`,
    method: "GET",
    params: { lang, requestedDate },
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
