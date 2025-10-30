'use client'

import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { getAvailablePlayers } from '@/api/freespin'

import Table from '@/components/v2/table/table'

import { IUserData } from '@/types/users'

const initialPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
}

const PlayerList = () => {
  const [rows, setRows] = useState<IUserData[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(initialPagination)

  const [{ pageIndex, pageSize }, setPaginationState] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialPagination.limit,
    })

  // Define columns
  const columns: ColumnDef<IUserData>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => {
        const username = row.getValue('username') as string
        const avatar = row.original.avatar
        return (
          <div className='flex items-center gap-3'>
            {avatar && (
              <Image
                width={0}
                height={0}
                sizes='100vw'
                src={avatar}
                alt={username}
                className='bg-muted h-8 w-8 rounded-full object-cover'
              />
            )}
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>{username || 'N/A'}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'remoteId',
      header: 'Remote ID',
      cell: ({ row }) => {
        const remote_id = row.getValue('remoteId') as string
        return <span className='text-sm font-medium'>{remote_id}</span>
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('email') as string
        return <span className='text-sm font-medium'>{email}</span>
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Member Since',
      cell: ({ row }) => {
        const dateString = row.getValue('createdAt') as string
        const date = new Date(dateString)
        return (
          <div className='flex flex-col'>
            <span className='text-sm'>{format(date, 'dd.MM.yyyy')}</span>
          </div>
        )
      },
    },
  ]

  // Create table instance
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

  const fetchPlayers = useCallback(
    async ({ limit, page }: { limit: number; page: number }) => {
      const response = await getAvailablePlayers({
        page,
        limit,
      })
      setPagination(response.pagination)
      setRows(response.rows)
    },
    []
  )
  // Fetch data when pagination changes
  useEffect(() => {
    setLoading(true)
    fetchPlayers({
      limit: pageSize,
      page: pageIndex + 1,
    }).finally(() => {
      setLoading(false)
    })
  }, [fetchPlayers, pageIndex, pageSize])

  return (
    <Table
      table={table}
      columns={columns}
      loading={loading}
      pagination={pagination}
      pageIndex={pageIndex}
      pageSize={pageSize}
    />
  )
}

export default PlayerList
