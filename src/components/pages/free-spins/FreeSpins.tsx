'use client'

import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { endOfYear, format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

import { getFreeSpins, getFreeSpinsGames } from '@/api/freespin'

import Table from '@/components/v2/table/table'

// TypeScript interfaces
interface Game {
  _id: string
  game_code: string
  id: number
  origin: string
  banner: string
  category: string
  createdAt: string
  game_name: string
  home_page: boolean
  is_pinned: any
  metadata: any
  order: any
  provider_code: string
  status: number
  type: string
  updatedAt: string
}

interface User {
  _id: string
  username: string
  fullName: string
  avatar: string
  country: string
  isBanned: boolean
  locked: boolean
  remoteId: string
}

interface FreeSpinData {
  freeround_id: string
  title: string
  players: string[]
  games: Game[]
  available: number
  betLevel: string
  validTo: string
  created: string
  received: number
  users: User[]
  userCount: number
  gameCount: number
}

const FreeSpins = () => {
  const [rows, setRows] = useState<FreeSpinData[]>([])
  const [allRows, setAllRows] = useState<FreeSpinData[]>([])
  const [validTo, _setValidTo] = useState<string>(() => {
    const monthEndDate = endOfYear(new Date())
    return monthEndDate.toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState<boolean>(true)

  // Frontend pagination state
  const [{ pageIndex, pageSize }, setPaginationState] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  // Calculate pagination info for frontend
  const totalItems = allRows.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const pagination = {
    page: pageIndex + 1,
    limit: pageSize,
    total: totalItems,
    totalPages: totalPages,
  }

  // Define columns
  const columns: ColumnDef<FreeSpinData>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const title = row.getValue('title') as string
        return <span className='text-sm font-medium'>{title}</span>
      },
    },
    {
      accessorKey: 'users',
      header: 'Players',
      cell: ({ row }) => {
        const users = row.getValue('users') as User[]
        return (
          <div className='flex flex-col gap-1'>
            {users.slice(0, 3).map((user, index) => (
              <div key={index} className='flex items-center gap-2'>
                {user.avatar && (
                  <Image
                    width={0}
                    height={0}
                    sizes='100vw'
                    src={user.avatar}
                    alt={user.username}
                    className='bg-muted h-8 w-8 rounded-full object-cover'
                  />
                )}
                <span className='text-xs'>{user.username}</span>
              </div>
            ))}
            {users.length > 3 && (
              <span className='text-muted-foreground text-xs'>
                +{users.length - 3} more
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'games',
      header: 'Games',
      cell: ({ row }) => {
        const games = row.getValue('games') as Game[]
        return (
          <div className='flex flex-col gap-1'>
            {games.slice(0, 2).map((game, index) => (
              <div key={index} className='flex items-center gap-2'>
                {game.banner && (
                  <Image
                    width={0}
                    height={0}
                    sizes='100vw'
                    src={game.banner}
                    alt={game.game_name}
                    className='bg-muted h-8 w-8 rounded object-cover'
                  />
                )}
                <div className='flex flex-col gap-1'>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_MAIN_FRONTEND}/game/${game.provider_code}/${game.game_code}`}
                    target='_blank'
                    className='hover:text-brand-500 text-xs'
                  >{`${game.game_name}`}</Link>
                </div>
              </div>
            ))}
            {games.length > 2 && (
              <span className='text-muted-foreground text-xs'>
                +{games.length - 2} more
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'available',
      header: 'Available',
      cell: ({ row }) => {
        const available = row.getValue('available') as number
        return <span className='text-sm font-medium'>{available}</span>
      },
    },
    {
      accessorKey: 'betLevel',
      header: 'Bet Level',
      cell: ({ row }) => {
        const betLevel = row.getValue('betLevel') as string
        return (
          <span className='text-sm font-medium capitalize'>{betLevel}</span>
        )
      },
    },
    {
      accessorKey: 'validTo',
      header: 'Valid To',
      cell: ({ row }) => {
        const validTo = row.getValue('validTo') as string
        const date = new Date(validTo)
        return (
          <div className='flex flex-col'>
            <span className='text-sm'>{format(date, 'dd.MM.yyyy')}</span>
            <span className='text-muted-foreground text-xs'>
              {format(date, 'HH:mm')}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'created',
      header: 'Created',
      cell: ({ row }) => {
        const created = row.getValue('created') as string
        const date = new Date(created)
        return (
          <div className='flex flex-col'>
            <span className='text-sm'>{format(date, 'dd.MM.yyyy')}</span>
            <span className='text-muted-foreground text-xs'>
              {format(date, 'HH:mm')}
            </span>
          </div>
        )
      },
    },
  ]

  // Create table instance with frontend pagination
  const table = useReactTable({
    data: rows || [],
    columns,
    columnResizeMode: 'onEnd',
    enableColumnResizing: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Manual pagination since we're slicing data ourselves
  })

  const fetchFreeSpins = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getFreeSpins({ validTo: validTo })
      setAllRows(response.response)
    } catch (error) {
      console.error('Error fetching free spins:', error)
    } finally {
      setLoading(false)
    }
  }, [validTo])

  // const handleRemoveTest = async () => {
  //   try {
  //     await removeFreeSpins({
  //       freeSpinId: '68d5725b3c47762e731a2d7d',
  //       playerIds: ['2092419'],
  //     })
  //   } catch (error) {
  //     console.error('Error removing free spins:', error)
  //   }
  // }

  // Handle frontend pagination
  useEffect(() => {
    const startIndex = pageIndex * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = allRows.slice(startIndex, endIndex)
    setRows(paginatedData)
  }, [allRows, pageIndex, pageSize])

  useEffect(() => {
    fetchFreeSpins()
  }, [fetchFreeSpins])

  useEffect(() => {
    getFreeSpinsGames({
      page: 1,
      limit: 40,
    })
  }, [])

  return (
    <>
      <Table
        table={table}
        columns={columns}
        loading={loading}
        pagination={pagination}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </>
  )
}

export default FreeSpins
