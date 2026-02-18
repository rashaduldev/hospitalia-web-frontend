"use server";

import { apiClient } from "@/lib/api";
import { Appointment } from "@/types/appointment.type";
import { Paginated } from "@/types/user.type";
import { getAccessToken } from "../auth";

// Doctor upcoming appointments by doctor user id
export const getUpcomingAppointments = async (
  doctorUserId: number,
  page = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  lang?: string
) => {
  const token = await getAccessToken();
  const res = await apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/upcoming/doctorUserId/${doctorUserId}`,
    method: "GET",
    params: { 
      page, 
      pageSize, 
      sortBy, 
      ascOrDesc,
      ...(lang && { lang }),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

// Doctor today's appointments by doctor user id
export const getTodaysAppointments = async (
  doctorUserId: number,
  page = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  lang?: string
) => {
  const token = await getAccessToken();
  const res = await apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/today/doctorUserId/${doctorUserId}`,
    method: "GET",
    params: { 
      page, 
      pageSize, 
      sortBy, 
      ascOrDesc,
      ...(lang && { lang }),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};