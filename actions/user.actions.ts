import { apiClient } from "@/lib/api";

export const getCurrentUser = async (
    token: string,
    lang?: string,
) => {
  if (!token) return null;

  const res = await apiClient({
    endpoint: '/api/users/me',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: lang ? { lang } : undefined,
  });

  return res.payload;
};
