import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getCasinoGamesList } from '@/api/game'

import { useDebounce } from '@/hooks/useDebounce'

import InputField from '@/components/form/input/InputField'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'
import Table from '@/components/v2/table/table'

import { ICasinoGame } from '@/types/game'

interface GameListResponse {
  success: boolean
  rows: ICasinoGame[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const GameListModal = ({
  isOpen,
  selectedGame: selectedGameProp,
  onClose,
  onGameSelect,
}: {
  selectedGame: ICasinoGame | null
  isOpen: boolean
  onClose: () => void
  onGameSelect?: (selectedGameId: string | null) => void
}) => {
  const [rows, setRows] = useState<ICasinoGame[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  })
  const [selectedGame, setSelectedGame] = useState<ICasinoGame | null>(
    selectedGameProp
  )
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)

  // Frontend pagination state
  const [{ pageIndex, pageSize }, setPaginationState] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    })

  const handleGameSelect = useCallback(
    (game: ICasinoGame) => {
      if (selectedGame && selectedGame._id === game._id) {
        // If clicking the same game, deselect it
        setSelectedGame(null)
      } else {
        // Select the new game
        setSelectedGame(game)
      }
    },
    [selectedGame]
  )

  const handleSave = () => {
    onGameSelect(selectedGame?._id || null)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // Define columns
  const columns: ColumnDef<ICasinoGame>[] = useMemo(
    () => [
      {
        id: 'select',
        header: 'Select',
        cell: ({ row }) => {
          const game = row.original
          const isSelected = selectedGame?._id === game._id
          return (
            <input
              type='radio'
              name='game-selection'
              checked={isSelected}
              onChange={() => handleGameSelect(game)}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500'
            />
          )
        },
      },
      {
        accessorKey: 'game_name',
        header: 'Game Name',
        cell: ({ row }) => {
          const name = row.getValue('game_name') as string
          return <span className='text-sm font-medium'>{name}</span>
        },
      },
      {
        accessorKey: 'game_code',
        header: 'Game Code',
        cell: ({ row }) => {
          const code = row.getValue('game_code') as string
          return <span className='text-sm text-gray-600'>{code}</span>
        },
      },
      {
        accessorKey: 'provider_code',
        header: 'Provider',
        cell: ({ row }) => {
          const provider = row.getValue('provider_code') as string
          return <span className='text-sm text-gray-600'>{provider}</span>
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string
          return (
            <span className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 capitalize'>
              {type}
            </span>
          )
        },
      },
    ],
    [selectedGame, handleGameSelect]
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

  const fetchGameList = useCallback(async () => {
    try {
      setLoading(true)
      const response: GameListResponse = await getCasinoGamesList({
        page: pageIndex + 1,
        limit: pageSize,
        type: 'freespin',
        search: debouncedSearchTerm,
      })

      if (response.success) {
        setRows(response.rows)
        setPagination(response.pagination)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch game list')
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, debouncedSearchTerm])

  useEffect(() => {
    if (isOpen) {
      fetchGameList()
    }
  }, [isOpen, fetchGameList])

  useEffect(() => {
    setSelectedGame(selectedGameProp)
  }, [selectedGameProp])

  // Reset pagination when search term changes
  useEffect(() => {
    setPaginationState({ pageIndex: 0, pageSize })
  }, [debouncedSearchTerm, pageSize])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-[1200px] p-5 text-white lg:p-10'
    >
      <h4 className='text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90'>
        Game List
      </h4>

      {/* Selected Game Display */}
      {selectedGame && (
        <div className='mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
          <h5 className='mb-3 text-sm font-medium text-gray-700 dark:text-gray-300'>
            Selected Game
          </h5>
          <div className='flex items-center gap-2'>
            <span className='rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
              {selectedGame.game_name}
            </span>
            <button
              onClick={() => setSelectedGame(null)}
              className='text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100'
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className='mb-6'>
        <InputField
          placeholder='Search games...'
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className='w-full'
        />
      </div>

      <div className='space-y-6'>
        <Table
          table={table}
          columns={columns}
          loading={loading}
          pagination={pagination}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
      <div className='mt-8 flex w-full items-center justify-end gap-3'>
        <Button type='button' size='sm' variant='outline' onClick={onClose}>
          Close
        </Button>
        <Button
          type='button'
          size='sm'
          onClick={handleSave}
          disabled={!selectedGame}
        >
          {selectedGame ? 'Save Changes' : 'Select a game'}
        </Button>
      </div>
    </Modal>
  )
}

export default GameListModal
