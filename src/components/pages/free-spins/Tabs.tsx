'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const FreeSpinTabs = () => {
  const router = useRouter()
  const [value, setValue] = useState('/')
  const handleValueChange = (value: string) => {
    setValue(value)
    router.push(`/game/free-spins${value}`)
  }
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.split('/')[3]) {
      setValue(`/${pathname.split('/')[3]}`)
    } else {
      setValue('/')
    }
  }, [pathname])

  return (
    <Tabs value={value} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value='/'>
          <span className='text-lg font-bold dark:text-white'>Free Spins</span>
        </TabsTrigger>
        <TabsTrigger value='/players'>
          <span className='text-lg font-bold dark:text-white'>
            Available Players
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default FreeSpinTabs
