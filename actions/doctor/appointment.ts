"use server";

import { apiClient } from "@/lib/api";
import { Appointment } from "@/types/appointment.type";
import { Paginated } from "@/types/user.type";

// Get all upcoming appointments by doctor user id - paginated
export const getUpcomingAppointments = async (doctorUserId: string, page = 1) => {
  return apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/upcoming/doctorUserId/${doctorUserId}`,
    method: "GET",
    params: { page },
  });
};

// Get all today's appointments by doctor user id - paginated
export const getTodaysAppointments = async (doctorUserId: string, page = 1) => {
  return apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/today/doctorUserId/${doctorUserId}`,
    method: "GET",
    params: { page },
  });
};