'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getMetrics } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import Loading from '@/components/common/Loading'

import PixIcon from '../../../public/images/icons/pix.svg'

import { IMetrics } from '@/types/metrics'

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState<IMetrics>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMetrics = async () => {
    try {
      const metrics = await getMetrics()
      setMetrics(metrics)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching metrics')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return (
    <>
      {isLoading && <Loading />}
      {metrics && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
          <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
              <Image
                src='/images/icons/user-group.png'
                alt='User Group'
                className='text-gray-800 dark:text-white/90'
                width={48}
                height={48}
                priority
              />
            </div>

            <div className='mt-5 flex items-end justify-between'>
              <div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {metrics?.[0]?.key}
                </span>
                <h4 className='text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90'>
                  {formatNumber(metrics?.[0]?.value || 0)}
                </h4>
              </div>

              {/* <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                <Badge
                  color={
                    metrics?.[0]?.upgradingPercentage > 0 ? 'success' : 'error'
                  }
                >
                  {metrics?.[0]?.upgradingPercentage > 0 ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                  {metrics?.[0]?.upgradingPercentage}%
                  <span className='text-xs text-gray-500 dark:text-gray-500'></span>
                </Badge>{' '}
                VS last month
              </div> */}
            </div>
          </div>
          <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
              <PixIcon className='text-gray-800 dark:text-white/90' />
            </div>
            <div className='mt-5 flex items-end justify-between'>
              <div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {metrics?.[1]?.key}
                </span>
                <h4 className='text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90'>
                  TRY ₺ {formatNumber(metrics?.[1]?.value || 0)}
                </h4>
              </div>

              {/* <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                <Badge
                  color={
                    metrics?.[1]?.upgradingPercentage > 0 ? 'success' : 'error'
                  }
                >
                  {metrics?.[1]?.upgradingPercentage > 0 ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                  {metrics?.[1]?.upgradingPercentage}%
                </Badge>{' '}
                VS last month
              </div> */}
            </div>
          </div>
          <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
              <Image
                src='/images/icons/commission.png'
                alt='User Group'
                className='text-gray-800 dark:text-white/90'
                width={48}
                height={48}
                priority
              />
            </div>

            <div className='mt-5 flex items-end justify-between'>
              <div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {metrics?.[2]?.key}
                </span>
                <h4 className='text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90'>
                  {`TRY ₺ ${formatNumber(metrics?.[2]?.value || 0)}`}
                </h4>
              </div>

              {/* <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                <Badge
                  color={
                    metrics?.[2]?.upgradingPercentage > 0 ? 'success' : 'error'
                  }
                >
                  {metrics?.[2]?.upgradingPercentage > 0 ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                  {metrics?.[2]?.upgradingPercentage}%
                  <span className='text-xs text-gray-500 dark:text-gray-500'></span>
                </Badge>{' '}
                VS last month
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
