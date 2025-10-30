import { Metadata } from 'next'

import Transactions from '@/components/pages/transactions'

export const metadata: Metadata = {
  title: 'Transactions | TuaBet',
  description: 'This is transactions page for admins',
  // other metadata
}

export default function TransactionsPage() {
  return <Transactions />
}
