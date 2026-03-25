"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";
import { revalidatePath } from "next/cache";

// Get all weekly availability
export const getDoctorAvailability = async ({
  doctorId,
  lang,
}: {
  doctorId: number;
  lang: string;
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/doctors/availability/all/doctorId/${doctorId}/status`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Get doctor's all weekly availability schedule by doctorId and location
export const getDoctorAvailabilityWithLocation = async ({
  doctorId,
  doctorLocationId,
  lang,
}: {
  doctorId: number;
  doctorLocationId: number;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: `/api/doctors/availability/all/doctorId/${doctorId}/location/${doctorLocationId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

// Get doctor's weekly availability by doctorId and location (public)
export const getDoctorAvailabilityByDoctorId = async ({
  doctorId,
  doctorLocationId,
  lang,
}: {
  doctorId: number;
  doctorLocationId: number;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: `/api/doctors/availability/all/doctorId/${doctorId}/location/${doctorLocationId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

// Create/Set doctors weekly availability schedule
export const createDoctorAvailability = async ({
  lang,
  doctorId,
  weeklySchedule,
}: {
  lang: string;
  doctorId: number;
  weeklySchedule: {
    availabilityStatus: string;
    doctorLocationId: number;
    startTime: string;
    endTime: string;
    timeSlot: string;
    dayOfWeek: string;
  }[];
}) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/api/doctors/availability/create",
    method: "POST",
    body: {
      doctorId,
      weeklySchedule,
    },
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/availability");
  return res;
};

// Update a doctor's availability slot
export const updateDoctorAvailability = async ({
  doctorId,
  availabilityIds,
  weeklySchedule: [
    {
      dayOfWeek,
      startTime,
      endTime,
      timeSlot,
      doctorLocationId,
      availabilityStatus,
    },
  ],
}: {
  doctorId: number;
  availabilityIds: [number];
  weeklySchedule: [
    {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      timeSlot: string;
      doctorLocationId: number;
      availabilityStatus: string;
    },
  ];
}) => {
  const token = await getAccessToken();

  const payload = {
    doctorId,
    availabilityIds: [availabilityIds],
    weeklySchedule: [
      {
        dayOfWeek,
        startTime,
        endTime,
        timeSlot,
        doctorLocationId,
        availabilityStatus,
      },
    ],
  };

  const res = await apiClient({
    endpoint: "/api/doctors/availability/update",
    method: "PUT",
    body: payload,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Delete an availability slot
export const deleteAvailabilitySlot = async ({ id }: { id: number }) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/api/doctors/availability/${id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath("/doctor/availability");
  return res;
};
