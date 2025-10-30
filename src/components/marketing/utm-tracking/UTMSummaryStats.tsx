'use client'
import cn from 'classnames'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { formatNumber } from '@/lib/utils'
import { getUtmSourceOptions } from '@/lib/utils'

import Loading from '@/components/common/Loading'

import { UTMTrackingTotalRow } from '@/types/utm-track'

const UTM_SOURCE_OPTIONS = getUtmSourceOptions(true)

UTM_SOURCE_OPTIONS.unshift({
  label: 'All',
  value: 'all',
  icon: '/images/icons/user-group.png',
})

interface UTMSummaryStatsProps {
  data: UTMTrackingTotalRow[]
}

const UTMSummaryStats = ({ data }: UTMSummaryStatsProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && data && (
        <div
          className={cn(
            'mb-5 grid grid-cols-1 gap-4 md:gap-6',
            'xl:grid-cols-3',
            'md:grid-cols-2',
            'sm:grid-cols-1'
          )}
        >
          {UTM_SOURCE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={cn(
                'flex flex-col justify-between rounded-2xl md:flex-row',
                'border border-gray-200 bg-white p-5 md:pt-6 md:pr-4 md:pl-4 dark:border-gray-800 dark:bg-white/[0.03]'
              )}
            >
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
                  <Image
                    src={option.icon}
                    alt={option.label}
                    width={35}
                    height={35}
                  />
                </div>
                <div className='text-sm font-bold'>
                  <span className='block text-lg text-white'>
                    {option.label}
                  </span>
                  <span className='block text-xs font-light text-gray-500 dark:text-gray-400'>
                    Visitors | Registrations
                  </span>
                </div>
              </div>

              <div className='flex h-full items-center justify-between'>
                <div className='flex h-full items-center text-2xl font-bold text-gray-800 dark:text-white/90'>
                  {formatNumber(
                    data.find((row) => row.source === option.value)?.visitors ??
                      0
                  )}{' '}
                  |{' '}
                  {formatNumber(
                    data.find((row) => row.source === option.value)
                      ?.registeredUsers ?? 0
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default UTMSummaryStats
