"use server";

import { apiClient } from "@/lib/api";
import { AppointmentType } from "@/types/doctor.location.type";

export const getAppointmentTypes = async (lang: string = "en") => {
  const res = await apiClient<AppointmentType[]>({
    endpoint: `/api/appointments/type/all`,
    method: "GET",
    params: { lang },
  });
  return res;
};
