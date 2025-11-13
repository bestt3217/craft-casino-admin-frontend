'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

import { getCasinoReports } from '@/api/reports'

import { useI18n } from '@/context/I18nContext'

import { formatNumber } from '@/lib/utils'

import ComponentCard from '@/components/common/ComponentCard'
import DateRangeSelector from '@/components/common/DateRangeSelector'
import Select from '@/components/form/Select'
import MetricsCard from '@/components/metrics/MetricsCard'
import CasinoReportsTable from '@/components/reports/CasinoReportsTable'

import { CasinoReportsResponse } from '@/types/casino-reports'

type SortByOption =
  | 'totalBetAmount'
  | 'totalWinAmount'
  | 'totalGGR'
  | 'betCount'
  | 'winCount'
  | 'lastTxnAt'

const CasinoReports = () => {
  const { t } = useI18n()
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [reports, setReports] = useState<CasinoReportsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortByOption>('totalBetAmount')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const SORT_BY_OPTIONS = useMemo(
    () => [
      { value: 'totalBetAmount', label: t('reports.totalBetAmount') },
      { value: 'totalWinAmount', label: t('reports.totalWinAmount') },
      { value: 'totalGGR', label: t('reports.totalGGR') },
      { value: 'betCount', label: t('reports.betCount') },
      { value: 'winCount', label: t('reports.winCount') },
      { value: 'lastTxnAt', label: t('reports.lastTransaction') },
    ],
    [t]
  )

  const SORT_DIR_OPTIONS = useMemo(
    () => [
      { value: 'desc', label: t('reports.descending') },
      { value: 'asc', label: t('reports.ascending') },
    ],
    [t]
  )

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
        sortBy,
        sortDir,
      })

      if (response) {
        setReports(response)
      }
    } catch {
      toast.error(t('reports.failedToFetchCasinoReports'))
      setReports(null)
    } finally {
      setIsLoading(false)
    }
  }, [range, page, sortBy, sortDir, t])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSortByChange = (value: string) => {
    setSortBy(value as SortByOption)
    setPage(1) // Reset to first page when sorting changes
  }

  const handleSortDirChange = (value: string) => {
    setSortDir(value as 'asc' | 'desc')
    setPage(1) // Reset to first page when sorting changes
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
        title={t('reports.casinoReports')}
        desc={t('reports.viewDetailedCasinoReports')}
        action={<DateRangeSelector value={range} onChange={setRange} />}
      >
        {reports && (
          <>
            {/* Totals Cards */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <MetricsCard
                title={t('reports.totalBetAmount')}
                value={formatCurrency(reports.totals.totalBetAmount)}
                tooltipText={t('reports.sumOfAllBetsPlaced')}
              />
              <MetricsCard
                title={t('reports.totalWinAmount')}
                value={formatCurrency(reports.totals.totalWinAmount)}
                tooltipText={t('reports.sumOfAllWinningsPaid')}
              />
              <MetricsCard
                title={t('reports.totalGGR')}
                value={formatCurrency(reports.totals.totalGGR)}
                tooltipText={t('reports.grossGamingRevenue')}
              />
            </div>

            {/* Summary Info */}
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]'>
              <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                <span>
                  <strong>{t('reports.totalUsers')}</strong>{' '}
                  {formatNumber(reports.meta.totalUsers)}
                </span>
                <span>
                  <strong>{t('common.page')}:</strong> {reports.meta.page}{' '}
                  {t('common.of')} {reports.meta.totalPages}
                </span>
              </div>
            </div>

            {/* Sort Controls */}
            <div className='flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {t('reports.sortBy')}
                </label>
                <Select
                  options={SORT_BY_OPTIONS}
                  value={sortBy}
                  onChange={handleSortByChange}
                  className='min-w-[180px]'
                />
              </div>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {t('reports.order')}
                </label>
                <Select
                  options={SORT_DIR_OPTIONS}
                  value={sortDir}
                  onChange={handleSortDirChange}
                  className='min-w-[140px]'
                />
              </div>
            </div>
          </>
        )}
      </ComponentCard>

      {/* Reports Table */}
      {reports && (
        <ComponentCard title={t('reports.userReports')}>
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
            {t('reports.selectDateRangeToViewReports')}
          </p>
        </div>
      )}
    </div>
  )
}

export default CasinoReports
