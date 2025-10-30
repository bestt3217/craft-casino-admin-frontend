import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Role Management',
  description: 'Role Management page for TuaBet Admin Dashboard',
  // other metadata
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default layout
