import { apiClient } from "@/lib/api";

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
