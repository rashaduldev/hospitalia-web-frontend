"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";
import { revalidatePath } from "next/cache";

// Get all weekly availability
export const getDoctorAvailability = async ({
  doctorUserId,
  lang,
}: {
  doctorUserId: number;
  lang: string;
}) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/api/doctors/availability/all/doctorUserId/${doctorUserId}/status`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Create/Set doctors weekly availability schedule
export const createDoctorAvailability = async ({
  lang,
  doctorUserId,
  weeklySchedule,
}: {
  lang: string;
  doctorUserId: number;
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
      doctorUserId,
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
  doctorUserId,
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
  doctorUserId: number;
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
    doctorUserId,
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
