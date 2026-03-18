import { getCurrentUser } from '@/actions/user.actions';
import { getCurrentLocale } from '@/locales/server';
import { redirect } from 'next/navigation';

const ROLE_REDIRECT: Record<string, string> = {
  DOCTOR: '/doctor/dashboard',
  HOSPITAL: '/hospital/dashboard',
  ADMIN: '/admin/dashboard',
  PATIENT: '/patient/dashboard',
};

export default async function DashboardRedirectPage() {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });
  const role = res?.userType as string;
  const target = ROLE_REDIRECT[role];
  if (target) {
    redirect(target);
  }
  redirect('/');
}
