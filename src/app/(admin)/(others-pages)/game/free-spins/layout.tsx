import React from 'react'

import FreeSpinTabs from '@/components/pages/free-spins/Tabs'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='space-y-4 text-white'>
      <FreeSpinTabs />
      {children}
    </div>
  )
}

export default Layout
