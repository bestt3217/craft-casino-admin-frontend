'use client'

import { useCallback, useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

import { getCasinoReports } from '@/api/reports'

import { formatNumber } from '@/lib/utils'

import ComponentCard from '@/components/common/ComponentCard'
import DateRangeSelector from '@/components/common/DateRangeSelector'
import MetricsCard from '@/components/metrics/MetricsCard'
import CasinoReportsTable from '@/components/reports/CasinoReportsTable'

import { CasinoReportsResponse } from '@/types/casino-reports'

const CasinoReports = () => {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [reports, setReports] = useState<CasinoReportsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const formatCurrency = (amount: number) => {
    return `TRY ₺ ${formatNumber(Number(amount.toFixed(2)))}`
  }

  const fetchReports = useCallback(async () => {
    if (!range?.from || !range?.to) {
      setReports(null)
      return
    }

    try {
      setIsLoading(true)
      const response = await getCasinoReports({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
        page,
        limit: 25,
      })

      if (response) {
        setReports(response)
      }
    } catch {
      toast.error('Failed to fetch casino reports')
      setReports(null)
    } finally {
      setIsLoading(false)
    }
  }, [range, page])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Reset page when date range changes
  useEffect(() => {
    if (range?.from && range?.to) {
      setPage(1)
    }
  }, [range?.from, range?.to])

  return (
    <div className='space-y-6'>
      <ComponentCard
        title='Casino Reports'
        desc='View detailed casino reports by date range'
        action={<DateRangeSelector value={range} onChange={setRange} />}
      >
        {reports && (
          <>
            {/* Totals Cards */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <MetricsCard
                title='Total Bet Amount'
                value={formatCurrency(reports.totals.totalBetAmount)}
                tooltipText='Sum of all bets placed by players'
              />
              <MetricsCard
                title='Total Win Amount'
                value={formatCurrency(reports.totals.totalWinAmount)}
                tooltipText='Sum of all winnings paid to players'
              />
              <MetricsCard
                title='Total GGR'
                value={formatCurrency(reports.totals.totalGGR)}
                tooltipText='Gross Gaming Revenue (Total Bet - Total Win)'
              />
            </div>

            {/* Summary Info */}
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]'>
              <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                <span>
                  <strong>Total Users:</strong>{' '}
                  {formatNumber(reports.meta.totalUsers)}
                </span>
                <span>
                  <strong>Page:</strong> {reports.meta.page} of{' '}
                  {reports.meta.totalPages}
                </span>
                <span>
                  <strong>Sort By:</strong> {reports.meta.sortBy} (
                  {reports.meta.sortDir})
                </span>
              </div>
            </div>
          </>
        )}
      </ComponentCard>

      {/* Reports Table */}
      {reports && (
        <ComponentCard title='User Reports'>
          <CasinoReportsTable
            data={reports.data}
            totalPages={reports.meta.totalPages}
            page={reports.meta.page}
            setPage={handlePageChange}
            isLoading={isLoading}
          />
        </ComponentCard>
      )}

      {!reports && !isLoading && range && (
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <p className='text-gray-500 dark:text-gray-400'>
            Select a date range to view casino reports
          </p>
        </div>
      )}
    </div>
  )
}

export default CasinoReports
