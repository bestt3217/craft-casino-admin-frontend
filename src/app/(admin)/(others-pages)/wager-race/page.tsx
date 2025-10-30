import { Metadata } from 'next'

import WagerRaceListPage from '@/components/pages/wagerRace/WagerRaceList'

export const metadata: Metadata = {
  title: 'Next.js Wager Race Table',
  description: 'This is Next.js Wager Race Table  page',
}

export default function BasicTables() {
  return <WagerRaceListPage />
}
