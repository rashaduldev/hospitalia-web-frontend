import { useParams } from 'next/navigation';

export function useLocalePath(path: string) {
  const params = useParams();
  const locale = params?.locale ?? 'en';
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}
