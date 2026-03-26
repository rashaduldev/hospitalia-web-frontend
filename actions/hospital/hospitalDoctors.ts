'use server';

import { apiClient } from '@/lib/api';
import { getAccessToken } from '../auth';

export type HospitalDoctorResponse = {
  id: number;
  hospitalId: number;
  doctorId: number;
  hospitalLocationId: number;
  doctorLocationId: number;
  doctorName: string;
  hospitalLocationName: string;
};

export const getDoctorsByHospital = async ({
  lang,
  hospitalId,
}: {
  lang: string;
  hospitalId: number;
}) => {
  const token = await getAccessToken();
  return apiClient<HospitalDoctorResponse[]>({
    endpoint: `/api/hospital-doctors/hospital/${hospitalId}`,
    method: 'GET',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const assignDoctorToHospital = async ({
  lang,
  hospitalId,
  doctorId,
  hospitalLocationId,
}: {
  lang: string;
  hospitalId: number;
  doctorId: number;
  hospitalLocationId: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: '/api/hospital-doctors/assign',
    method: 'POST',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { hospitalId, doctorId, hospitalLocationId },
  });
};

export const getPublicHospitalDoctors = async ({
  lang,
  hospitalId,
}: {
  lang: string;
  hospitalId: number;
}) => {
  return apiClient<HospitalDoctorResponse[]>({
    endpoint: `/api/hospital-doctors/hospital/${hospitalId}`,
    method: 'GET',
    params: { lang },
  });
};

export const importDoctorsFromXlsx = async ({
  lang,
  formData,
}: {
  lang: string;
  formData: FormData;
}) => {
  const token = await getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/import/xlsx?lang=${lang}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );
  return res.json();
};

export const getImportedDoctorsByUser = async ({
  lang,
  userId,
  pageNo = 0,
  pageSize = 100,
  sortBy = 'firstName',
  ascOrDesc = 'asc',
}: {
  lang: string;
  userId: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
}) => {
  const token = await getAccessToken();
  return apiClient<{
    content: import('@/types/doctor').SingleDoctorInfo[];
    totalElements: number;
  }>({
    endpoint: `/api/doctors/imported-by/${userId}`,
    method: 'GET',
    params: { lang, pageNo, pageSize, sortBy, ascOrDesc },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const downloadDoctorImportSample = async ({
  lang,
}: {
  lang: string;
}): Promise<{ base64: string; filename: string } | null> => {
  const token = await getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/import/sample?lang=${lang}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return null;
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const disposition = res.headers.get('content-disposition') ?? '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] ?? 'doctors_import_sample.xlsx';
  return { base64, filename };
};

export const unassignDoctorFromHospital = async ({
  lang,
  id,
}: {
  lang: string;
  id: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/hospital-doctors/unassign/${id}`,
    method: 'DELETE',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};
