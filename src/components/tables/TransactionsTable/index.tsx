'use client'
import React, { useMemo } from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '@/components/common/Skeleton'
import PageLimitSelector from '@/components/tables/PageLimitSelector'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TransactionsTableProps = {
  rows: CryptoTransaction[]
  columns: any[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  limit?: number
  setLimit?: (limit: number) => void
  isLoading?: boolean
  loadingClassName?: string
}

export default function TransactionsTable({
  rows,
  columns,
  totalPages,
  page,
  setPage,
  limit,
  setLimit,
  isLoading,
  loadingClassName,
}: TransactionsTableProps) {
  const filteredColumns = useMemo(
    () => columns.filter((column) => !column?.disabled),
    [columns]
  )

  const skeletonRowCount = limit || 5

  return (
    <>
      <div className='w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto'>
          <Table>
            {/* Table Header */}
            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
              <TableRow>
                {filteredColumns.map(({ label }, i) => (
                  <TableCell
                    key={i}
                    isHeader
                    className={cn(
                      'text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: skeletonRowCount }).map((_, r) => (
                  <TableRow key={`skeleton-${r}`}>
                    {filteredColumns.map((_, i) => (
                      <TableCell
                        key={i}
                        className={cn(
                          'text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'
                        )}
                      >
                        <Skeleton
                          className={cn('h-4 w-full', loadingClassName)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows && rows.length > 0 ? (
                // Actual data rows
                rows.map((row, r) => (
                  <TableRow key={r}>
                    {filteredColumns.map(({ render }, i) => (
                      <TableCell
                        key={i}
                        className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'
                      >
                        {render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Empty state
                <TableRow>
                  <TableCell
                    colSpan={filteredColumns.length}
                    className='text-center'
                  >
                    <p className='py-2 text-gray-500 dark:text-gray-400'>
                      No records yet
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className='relative min-h-15'>
            {!isLoading && totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
                className='mb-5 justify-center'
              />
            )}
            <div className='absolute right-10 bottom-5'>
              <PageLimitSelector handleChangeLimit={setLimit} limit={limit} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
