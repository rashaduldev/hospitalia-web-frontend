'use server';

import { apiClient } from '@/lib/api';
import { getAccessToken } from '@/actions/auth';
import { SecretaryLocation } from '@/types/secretary.type';

export const assignLocationToSecretary = async ({
  lang,
  secretaryId,
  locationId,
}: {
  lang: string;
  secretaryId: number;
  locationId: number;
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryLocation>({
    endpoint: '/api/secretary-locations/assign',
    method: 'POST',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { secretaryId, locationId },
  });
};

export const removeSecretaryLocation = async ({
  lang,
  secretaryId,
  locationId,
}: {
  lang: string;
  secretaryId: number;
  locationId: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: '/api/secretary-locations/remove',
    method: 'DELETE',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { secretaryId, locationId },
  });
};

export const getSecretaryLocations = async ({
  secretaryId,
  lang,
}: {
  secretaryId: number;
  lang: string;
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryLocation[]>({
    endpoint: `/api/secretary-locations/secretary/${secretaryId}`,
    method: 'GET',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};
