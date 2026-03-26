'use server';

import { apiClient } from '@/lib/api';
import { getAccessToken } from '@/actions/auth';
import { SecretaryLocation, SecretaryPermission } from '@/types/secretary.type';

export const assignLocationToSecretary = async ({
  lang,
  userId,
  locationId,
  permissions,
}: {
  lang: string;
  userId: number;
  locationId: number;
  permissions: SecretaryPermission[];
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryLocation>({
    endpoint: '/api/secretary-locations/assign',
    method: 'POST',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { userId, locationId, permissions },
  });
};

export const removeSecretaryLocation = async ({
  lang,
  userId,
  locationId,
  permissions,
}: {
  lang: string;
  userId: number;
  locationId: number;
  permissions: SecretaryPermission[];
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: '/api/secretary-locations/remove',
    method: 'DELETE',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { userId, locationId, permissions },
  });
};

export const getSecretaryLocations = async ({
  userId,
  lang,
}: {
  userId: number;
  lang: string;
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryLocation[]>({
    endpoint: `/api/secretary-locations/secretary/userId/${userId}`,
    method: 'GET',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateSecretaryLocationPermissions = async ({
  lang,
  userId,
  locationId,
  permissions,
}: {
  lang: string;
  userId: number;
  locationId: number;
  permissions: SecretaryPermission[];
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryLocation>({
    endpoint: '/api/secretary-locations/update',
    method: 'PUT',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { userId, locationId, permissions },
  });
};
