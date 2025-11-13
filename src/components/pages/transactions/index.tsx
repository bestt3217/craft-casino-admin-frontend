'use client'

import { RotateCcw } from 'lucide-react'
import moment from 'moment'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  approveWithdrawal,
  getSeedData,
  getTransactions,
  rejectDepositRequest,
  rejectWithdrawal,
} from '@/api/transactions'

import { useI18n } from '@/context/I18nContext'

import { TRANSACTION_STATUSES } from '@/lib/transaction'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import { Skeleton } from '@/components/common/Skeleton'
import Select from '@/components/form/Select'
import TransactionsTable from '@/components/tables/TransactionsTable'
import PaymentMethodCell from '@/components/tables/TransactionsTable/PaymentMethodCell'
import StatusCell from '@/components/tables/TransactionsTable/StatusCell'
import UserCell from '@/components/tables/TransactionsTable/UserCell'
import { Card } from '@/components/ui/card'

export default function Transactions() {
  const { type } = useParams()
  const { t } = useI18n()

  const title = useMemo(
    () => (type === 'deposit' ? t('common.deposits') : t('common.withdrawals')),
    [type, t]
  )

  const statusOptions = useMemo(() => {
    if (type === 'deposit') {
      return [
        {
          label: t('common.all'),
          value: '',
        },
        {
          label: t('common.pending'),
          value: String(TRANSACTION_STATUSES.CREATED),
        },
        {
          label: t('common.paid'),
          value: String(TRANSACTION_STATUSES.PAID),
        },
        {
          label: t('common.rejected'),
          value: String(TRANSACTION_STATUSES.REJECTED),
        },
      ]
    }

    return [
      {
        label: t('common.all'),
        value: '',
      },
      {
        label: t('common.pending'),
        value: String(TRANSACTION_STATUSES.WAITING_APPROVAL),
      },
      {
        label: t('common.paid'),
        value: String(TRANSACTION_STATUSES.PAID),
      },
      {
        label: t('common.rejected'),
        value: String(TRANSACTION_STATUSES.REJECTED),
      },
    ]
  }, [type, t])

  const tableColumns = useMemo(
    () => [
      {
        id: 'user',
        label: t('common.user'),
        col: 2,
        render: (item: any) => <UserCell user={item.userId} />,
      },
      {
        id: 'method',
        label: t('common.paymentMethod'),
        col: 2,
        render: (item) => <PaymentMethodCell method={item.method} />,
      },
      {
        id: 'paymentKey',
        label: t('common.accountNumber'),
        col: 2,
        disabled: type === 'deposit',
        render: (item) => item.paymentKey,
      },
      {
        id: 'amount',
        label: t('common.amount'),
        col: 2,
        render: (item) => {
          if (item.status !== 1 && type === 'deposit') {
            return t('common.na')
          }

          return Number(item.amount).toFixed(2)
        },
      },
      {
        id: 'time',
        label: t('common.time'),
        col: 2,
        render: (item) => moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: 'status',
        label: t('common.status'),
        col: 2,
        render: (item) => <StatusCell item={item} />,
      },
      {
        id: 'action',
        label: t('common.action'),
        col: 2,
        render: (item: any) => (
          <>
            {item.status === 0 && type === 'deposit' && (
              <div className='flex items-center gap-2'>
                <button
                  className='bg-error-500 shadow-theme-xs hover:bg-error-600 rounded-xl px-3 py-[6px] text-sm font-medium text-white transition-colors'
                  onClick={() => handleDepositRequestReject(item._id)}
                >
                  {t('common.reject')}
                </button>
              </div>
            )}

            {item.status === 2 ? (
              <div className='flex items-center gap-2'>
                <button
                  className='bg-success-500 shadow-theme-xs hover:bg-success-600 rounded-xl px-3 py-[6px] text-sm font-medium text-white transition-colors'
                  onClick={() => handleApproveWithdrawal(item._id)}
                >
                  {t('common.approve')}
                </button>
                <button
                  className='bg-error-500 shadow-theme-xs hover:bg-error-600 rounded-xl px-3 py-[6px] text-sm font-medium text-white transition-colors'
                  onClick={() => handleRejectWithdrawal(item._id)}
                >
                  {t('common.reject')}
                </button>
              </div>
            ) : null}
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, t]
  )

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingSeedData, setIsLoadingSeedData] = useState<boolean>(true)
  const [tableData, setTableData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(5)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const [seedData, setSeedData] = useState<any>({
    paid: {
      count: 0,
      totalAmount: 0,
    },
    pending: {
      count: 0,
      totalAmount: 0,
    },
    health: {
      percent: 0,
      description: '',
    },
  })

  const fetchSeedData = useCallback(async () => {
    try {
      setIsLoadingSeedData(true)
      const res = await getSeedData({ type: type as string })
      const paid = {
        count: res.paid.count,
        totalAmount: Number(res.paid.totalAmount).toFixed(2),
      }
      const pending = {
        count: res.pending.count,
        totalAmount: Number(res.pending.totalAmount).toFixed(2),
      }
      const rate = Math.max(
        Math.min(
          Math.ceil(
            (res.paid.count / (res.paid.count + res.pending.count || 1)) * 100
          ),
          100
        ),
        0
      )

      const health = {
        percent: rate,
        description:
          rate < 50
            ? t('common.approvalRateLow')
            : rate < 70
              ? t('common.approvalRateModerate')
              : t('common.approvalRateGood'),
      }

      setSeedData({ paid, pending, health })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('common.errorFetchingSeedData'))
      }
    } finally {
      setIsLoadingSeedData(false)
    }
  }, [type, t])

  useEffect(() => {
    fetchSeedData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const fetchTransactions = async ({
    page,
    search,
    status,
  }: {
    page: number
    search?: string
    status?: string
  }) => {
    try {
      setIsLoading(true)

      const filters: any = {
        type: type as string,
        search: search !== undefined ? search : searchTerm || undefined,
        status: status !== undefined ? status : selectedStatus || undefined,
      }

      const response = await getTransactions({
        page,
        limit,
        filters,
      })

      setTableData(response.rows)
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('common.errorFetchingTransactions'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions({ page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit])

  useEffect(() => {
    fetchTransactions({ page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus])

  const handleChangePage = (page: number) => {
    setPage(page)
    fetchTransactions({ page })
  }

  const handleChangePageLimit = (limit: number) => {
    setLimit(limit)
  }

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    fetchTransactions({ page: 1, search: value })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleApproveWithdrawal = async (transactionId: string) => {
    try {
      setIsLoading(true)

      await approveWithdrawal(transactionId)
      fetchTransactions({ page })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('common.errorApprovingWithdrawal'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDepositRequestReject = async (transactionId: string) => {
    try {
      setIsLoading(true)
      await rejectDepositRequest(transactionId)
      fetchTransactions({ page })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('common.errorRejectingWithdrawal'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectWithdrawal = async (transactionId: string) => {
    try {
      setIsLoading(true)

      await rejectWithdrawal(transactionId)
      fetchTransactions({ page })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('common.errorRejectingWithdrawal'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = useCallback((value: string) => {
    setSelectedStatus(value)
  }, [])

  const handleReload = useCallback(() => {
    setPage(1)
    fetchTransactions({ page: 1 })
    fetchSeedData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSeedData])

  return (
    <ComponentCard
      title={title}
      inputSearchElement={
        <div className='flex items-center gap-2'>
          <Select
            options={statusOptions || []}
            placeholder={t('common.selectStatus')}
            onChange={handleChangeStatus}
            value={selectedStatus}
            className='min-w-[200px]'
          />
          <InputSearch className='dark:bg-gray-900' fetchData={handleSearch} />
          <button
            onClick={handleReload}
            className='flex h-11 min-w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
            title={t('common.reload')}
            aria-label={t('common.reload')}
          >
            <RotateCcw className='h-5 w-5' />
          </button>
        </div>
      }
    >
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Card>
          <h3 className='text-sm font-medium text-gray-400'>
            {t('common.approved')}
          </h3>
          {isLoadingSeedData ? (
            <>
              <Skeleton className='mb-2 h-8 w-16' />
              <Skeleton className='h-4 w-48' />
            </>
          ) : (
            <>
              <p className='text-2xl font-bold text-white'>
                {seedData.paid.count}
              </p>
              <p className='text-sm text-gray-400'>
                {t('common.totalApproved')} | TRY ₺ {seedData.paid.totalAmount}
              </p>
            </>
          )}
        </Card>
        <Card>
          <h3 className='text-sm font-medium text-gray-400'>
            {t('common.pending')}
          </h3>
          {isLoadingSeedData ? (
            <>
              <Skeleton className='mb-2 h-8 w-16' />
              <Skeleton className='h-4 w-48' />
            </>
          ) : (
            <>
              <p className='text-2xl font-bold text-white'>
                {seedData.pending.count}
              </p>
              <p className='text-sm text-gray-400'>
                {t('common.totalOutstanding')} | TRY ₺{' '}
                {seedData.pending.totalAmount}
              </p>
            </>
          )}
        </Card>
        <Card>
          <h3 className='text-sm font-medium text-gray-400'>
            {t('common.health')}
          </h3>
          {isLoadingSeedData ? (
            <>
              <Skeleton className='mb-2 h-8 w-16' />
              <Skeleton className='h-4 w-48' />
            </>
          ) : (
            <>
              <p className='text-2xl font-bold text-white'>
                {seedData.health.percent}%
              </p>
              <p className='text-sm text-gray-400'>
                {seedData.health.description}
              </p>
            </>
          )}
        </Card>
      </div>
      <TransactionsTable
        columns={tableColumns}
        rows={tableData}
        totalPages={totalPages}
        setPage={handleChangePage}
        setLimit={handleChangePageLimit}
        limit={limit}
        page={page}
        isLoading={isLoading}
        loadingClassName='h-10'
      />
    </ComponentCard>
  )
}
