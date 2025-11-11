'use client'

import moment from 'moment'
import Image from 'next/image'
import React from 'react'

import { formatNumber } from '@/lib/utils'

import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CasinoReportUser } from '@/types/casino-reports'

interface CasinoReportsTableProps {
  data: CasinoReportUser[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading?: boolean
}

const CasinoReportsTable = ({
  data,
  totalPages,
  page,
  setPage,
  isLoading,
}: CasinoReportsTableProps) => {
  const formatCurrency = (amount: number) => {
    return `₺ ${formatNumber(Number(amount.toFixed(2)))}`
  }

  return (
    <>
      {isLoading ? (
        <Skeleton className='h-[400px] w-full rounded-2xl' />
      ) : (
        <>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <div className='min-w-[1200px]'>
                <Table>
                  {/* Table Header */}
                  <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                    <TableRow>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Username
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Total Bet Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Total Win Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Total GGR
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Bet Count
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Win Count
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Avg Bet
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        First Transaction
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Last Transaction
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                    {data && data.length > 0 ? (
                      data.map((row) => (
                        <TableRow key={row.userId}>
                          <TableCell className='text-theme-sm px-4 py-3 text-left text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center gap-2'>
                              <Image
                                src={row.userAvatar}
                                alt={row.username}
                                width={20}
                                height={20}
                              />
                              <span>{row.username}</span>
                            </div>
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.email}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {formatCurrency(row.totalBetAmount)}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {formatCurrency(row.totalWinAmount)}
                          </TableCell>
                          <TableCell
                            className={`text-theme-sm px-4 py-3 text-center font-medium ${
                              row.totalGGR >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {formatCurrency(row.totalGGR)}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {formatNumber(row.betCount)}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {formatNumber(row.winCount)}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {formatCurrency(row.avgBet)}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {moment(row.firstTxnAt).format(
                              'MMM D, YYYY, h:mm A'
                            )}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {moment(row.lastTxnAt).format(
                              'MMM D, YYYY, h:mm A'
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className='text-center'>
                          <p className='py-8 text-gray-500 dark:text-gray-400'>
                            No records found
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className='border-t border-gray-100 p-4 dark:border-white/[0.05]'>
                  <Pagination
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={setPage}
                    className='justify-center'
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default CasinoReportsTable
