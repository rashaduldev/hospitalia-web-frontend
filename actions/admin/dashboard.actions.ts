'use server';

import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api';
import { DashboardData } from '@/types/admin.dashboard.type';
import { ApiResponse } from '@/types/user.type';

export async function getAdminDashboardData(): Promise<
  ApiResponse<DashboardData>
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      status: 'error',
      message: 'Authentication required. Please log in.',
      payload: null,
      success: false,
    };
  }

  try {
    const response = await apiClient<DashboardData>({
      endpoint: '/api/admin/stats/dashboard',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return {
      status: 'error',
      message: 'Failed to fetch dashboard data. Please try again.',
      payload: null,
      success: false,
    };
  }
}
