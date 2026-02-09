import { I18nProviderClient } from '@/locales/client'
import { ReactElement } from 'react'
 

export default async function AppClientProvider({ params, children }: { params: Promise<{ locale: string }>, children: ReactElement }) {
  const { locale } = await params
 
  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  )
}
