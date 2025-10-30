import type { Metadata } from 'next'

import Dashboard from '@/components/ecommerce'

export const metadata: Metadata = {
  title: 'iGaming Dashboard | TuaBet Admin',
  description: 'TuaBet Admin',
}

export default function Ecommerce() {
  return <Dashboard />
}
