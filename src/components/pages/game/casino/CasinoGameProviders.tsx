'use client'

import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { PencilIcon } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { getCasinoGameProviders } from '@/api/game'

import { cn } from '@/lib/utils'

import CasinoGameProviderModal from '@/components/pages/game/casino/CasinoGameProviderModal'
import Table from '@/components/v2/table/table'

import { ICasinoGameProvider } from '@/types/game'

interface CasinoGameProvidersResponse {
  success: boolean
  rows: ICasinoGameProvider[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const CasinoGameProviders = () => {
  const [rows, setRows] = useState<ICasinoGameProvider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const [selectedItem, setSelectedItem] = useState<ICasinoGameProvider | null>(
    null
  )
  const [openModal, setOpenModal] = useState<boolean>(false)

  // Frontend pagination state
  const [{ pageIndex, pageSize }, setPaginationState] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  // Define columns
  const columns: ColumnDef<ICasinoGameProvider>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Provider Name',
        cell: ({ row }) => {
          const name = row.getValue('name') as string
          return <span className='text-sm font-medium'>{name}</span>
        },
      },
      {
        accessorKey: 'code',
        header: 'Codes',
        cell: ({ row }) => {
          const codes = row.getValue('code') as string[]
          return (
            <div className='flex flex-wrap gap-1'>
              {codes.map((code, index) => (
                <span
                  key={index}
                  className='bg-muted text-muted-foreground rounded px-2 py-1 text-xs'
                >
                  {code}
                </span>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'type',
        header: 'Types',
        cell: ({ row }) => {
          const types = row.getValue('type') as string[]
          return (
            <div className='flex flex-wrap gap-1'>
              {types.map((type, index) => (
                <span
                  key={index}
                  className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 capitalize'
                >
                  {type}
                </span>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'origin',
        header: 'Origins',
        cell: ({ row }) => {
          const origins = row.getValue('origin') as string[]
          const status = (row.original.status || []) as number[]
          return (
            <div className='flex flex-wrap gap-1'>
              {origins.map((origin, index) => (
                <span
                  key={index}
                  className={cn(
                    'rounded bg-green-100 px-2 py-1 text-xs text-green-800',
                    {
                      'bg-red-100 px-2 py-1 text-xs text-red-800':
                        status[index] === 0,
                    }
                  )}
                >
                  {origin}
                </span>
              ))}
            </div>
          )
        },
      },
      {
        id: 'action',
        header: '',
        cell: ({ row }) => {
          return (
            <div className='flex items-center justify-center gap-2'>
              <button
                className='hover:text-brand-600 font-medium'
                onClick={() => {
                  setSelectedItem(row.original)
                  setOpenModal(true)
                }}
              >
                <PencilIcon size={16} />
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

  // Create table instance with frontend pagination
  const table = useReactTable({
    data: rows || [],
    columns,
    columnResizeMode: 'onEnd',
    enableColumnResizing: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response: CasinoGameProvidersResponse =
        await getCasinoGameProviders({
          page: pageIndex + 1,
          limit: pageSize,
        })

      if (response.success) {
        setRows(response.rows)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching casino game providers:', error)
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className='space-y-6'>
      {/* <CasinoGameProviderFilters /> */}
      <Table
        table={table}
        columns={columns}
        loading={loading}
        pagination={pagination}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
      <CasinoGameProviderModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        selectedItem={selectedItem}
        onSuccess={() => {
          setOpenModal(false)
          fetchData()
        }}
      />
    </div>
  )
}

export default CasinoGameProviders
