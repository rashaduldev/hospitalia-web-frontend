'use server';

import { apiClient } from '@/lib/api';
import { getAccessToken } from '@/actions/auth';
import { Appointment } from '@/types/appointment.type';
import { Paginated } from '@/types/user.type';

export const getSecretaryAppointments = async ({
  doctorId,
  locationId,
  lang,
  pageNo = 0,
  pageSize = 100,
}: {
  doctorId: number;
  locationId: number;
  lang: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  const token = await getAccessToken();
  return apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/doctorId/${doctorId}/doctorLocationId/${locationId}`,
    method: 'GET',
    params: { lang, pageNo, pageSize },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSecretaryAppointmentsByDate = async ({
  doctorId,
  locationId,
  date,
  lang,
  pageNo = 0,
  pageSize = 100,
}: {
  doctorId: number;
  locationId: number;
  date: string;
  lang: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  const token = await getAccessToken();
  return apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/doctorId/${doctorId}/date/doctorLocationId/${locationId}`,
    method: 'GET',
    params: { lang, date, pageNo, pageSize },
    headers: { Authorization: `Bearer ${token}` },
  });
};
