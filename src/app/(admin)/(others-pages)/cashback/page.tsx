import { Metadata } from 'next'

import CashbackListPage from '@/components/pages/cashback/CashbackList'

export const metadata: Metadata = {
  title: 'Next.js Cashback Table',
  description: 'This is Next.js Cashback Table  page',
}

export default function BasicTables() {
  return <CashbackListPage />
}
