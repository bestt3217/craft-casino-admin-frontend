import { Metadata } from 'next'
import React from 'react'

import AdminsList from '@/components/admin'

export const metadata: Metadata = {
  title: 'Admin Management',
  description: 'Admin Management page for TuaBet Admin Dashboard',
  // other metadata
}

export default function BasicTables() {
  return <AdminsList />
}
