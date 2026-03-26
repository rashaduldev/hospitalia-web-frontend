'use server';

import { apiClient } from '@/lib/api';
import { getAccessToken } from '@/actions/auth';
import { SecretaryResponse } from '@/types/secretary.type';
import { Paginated } from '@/types/user.type';

export const createSecretary = async ({
  lang,
  body,
}: {
  lang: string;
  body: {
    doctorUserId: number;
    firstName: string;
    lastName?: string;
    gender: string;
    email: string;
    countryCode: string;
    mobileNumber: string;
  };
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryResponse>({
    endpoint: '/api/secretaries/create',
    method: 'POST',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};

export const inviteSecretary = async ({
  lang,
  secretaryUserId,
}: {
  lang: string;
  secretaryUserId: number;
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryResponse>({
    endpoint: `/api/secretaries/invite/${secretaryUserId}`,
    method: 'POST',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const resendSecretaryInvitation = async ({
  lang,
  secretaryUserId,
}: {
  lang: string;
  secretaryUserId: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/secretaries/resend-invitation/${secretaryUserId}`,
    method: 'POST',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSecretaryInvitationInfo = async ({
  invitationToken,
  lang,
}: {
  invitationToken: string;
  lang: string;
}) => {
  return apiClient<{
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    gender: string;
  }>({
    endpoint: '/api/secretaries/invitation/info',
    method: 'GET',
    params: { invitationToken, lang },
  });
};

export const onboardSecretary = async ({
  invitationToken,
  lang,
  body,
}: {
  invitationToken: string;
  lang: string;
  body: {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    countryCode: string;
    mobileNumber: string;
    password: string;
  };
}) => {
  return apiClient<SecretaryResponse>({
    endpoint: '/api/secretaries/onboard',
    method: 'POST',
    params: { invitationToken, lang },
    body,
  });
};

export const getSecretaryByUserId = async ({
  userId,
  lang,
}: {
  userId: number;
  lang: string;
}) => {
  const token = await getAccessToken();
  return apiClient<SecretaryResponse>({
    endpoint: `/api/secretaries/userId/${userId}`,
    method: 'GET',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getDoctorSecretaries = async ({
  doctorUserId,
  lang,
  pageNo = 0,
  pageSize = 50,
  sortBy = 'firstName',
  ascOrDesc = 'asc',
}: {
  doctorUserId: number;
  lang: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
}) => {
  const token = await getAccessToken();
  return apiClient<Paginated<SecretaryResponse>>({
    endpoint: `/api/secretaries/doctorUserId/${doctorUserId}`,
    method: 'GET',
    params: { lang, pageNo, pageSize, sortBy, ascOrDesc },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteSecretaryByUserId = async ({
  userId,
  lang,
}: {
  userId: number;
  lang: string;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/secretaries/delete/userId/${userId}`,
    method: 'DELETE',
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};
