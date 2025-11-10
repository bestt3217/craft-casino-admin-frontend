'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getGameProviders, getGamesList } from '@/api/casino'

import { InputSearch } from '@/components/common/InputSearch'
import Loading from '@/components/common/Loading'
import Checkbox from '@/components/form/input/Checkbox'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ICasino, IGameProvider } from '@/types/casino'

export default function GamesTable({
  selectedGameIds,
  selectedGames,
  onSelectedChange,
  setSelectedGames,
}: {
  selectedGameIds: Set<string>
  selectedGames: ICasino[]
  onSelectedChange: (selected: Set<string>) => void
  setSelectedGames: (games: ICasino[]) => void
}) {
  // State
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tableData, setTableData] = useState<ICasino[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [providers, setProviders] = useState<IGameProvider[]>([])

  // Refs to track current values for callbacks
  const searchRef = useRef(search)
  const providerRef = useRef(selectedProvider)
  const pageRef = useRef(page)

  // Update refs when state changes
  useEffect(() => {
    searchRef.current = search
  }, [search])

  useEffect(() => {
    providerRef.current = selectedProvider
  }, [selectedProvider])

  useEffect(() => {
    pageRef.current = page
  }, [page])

  // Fetch providers on mount
  const fetchProviders = useCallback(async () => {
    try {
      const response = await getGameProviders()
      setProviders(response)
    } catch (error) {
      console.error('Error fetching game providers:', error)
    }
  }, [])

  // Fetch games data - uses refs to always get current values
  const fetchData = useCallback(
    async (params?: { page?: number; search?: string; provider?: string }) => {
      try {
        setIsLoading(true)

        // Use passed params or current ref values (always fresh)
        const currentPage = params?.page ?? pageRef.current
        const currentSearch = params?.search ?? searchRef.current
        const currentProvider = params?.provider ?? providerRef.current

        const response = await getGamesList({
          limit,
          page: currentPage,
          filter: currentSearch,
          code:
            currentProvider && currentProvider !== 'all'
              ? currentProvider
              : undefined,
        })

        setTableData(response.rows)
        setTotalPages(response.totalPages)
        setPage(response.currentPage)
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [limit]
  )

  // Handlers
  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value)
      setPage(1)
      // Use refs to ensure we get current provider value
      fetchData({
        search: value,
        page: 1,
        provider: providerRef.current,
      })
    },
    [fetchData]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      // Use refs to ensure we get current search and provider values
      fetchData({
        page: newPage,
        search: searchRef.current,
        provider: providerRef.current,
      })
    },
    [fetchData]
  )

  const handleProviderChange = useCallback(
    (providerCode: string) => {
      setSelectedProvider(providerCode)
      setPage(1)
      // Use refs to ensure we get current search value
      fetchData({
        provider: providerCode,
        page: 1,
        search: searchRef.current,
      })
    },
    [fetchData]
  )

  // Selection handlers
  const handleSelect = useCallback(
    (id: string) => {
      const newSelected = new Set(selectedGameIds)
      if (selectedGameIds.has(id)) {
        newSelected.delete(id)
        setSelectedGames(selectedGames.filter((game) => game._id !== id))
      } else {
        newSelected.add(id)
        const game = tableData.find((game) => game._id === id)
        if (game) {
          setSelectedGames([...selectedGames, game])
        }
      }
      onSelectedChange(newSelected)
    },
    [
      selectedGameIds,
      selectedGames,
      tableData,
      onSelectedChange,
      setSelectedGames,
    ]
  )

  // Memoize current page IDs for optimization
  const currentPageIds = useMemo(
    () => tableData.map((item) => item._id),
    [tableData]
  )

  // Memoize whether all current page items are selected
  const allCurrentPageSelected = useMemo(
    () =>
      tableData.length > 0 &&
      currentPageIds.every((id) => selectedGameIds.has(id)),
    [tableData.length, currentPageIds, selectedGameIds]
  )

  const handleSelectAll = useCallback(() => {
    const selectedSet = new Set(selectedGameIds)

    if (allCurrentPageSelected) {
      currentPageIds.forEach((id) => selectedSet.delete(id))
      setSelectedGames(
        selectedGames.filter((game) => !currentPageIds.includes(game._id))
      )
    } else {
      currentPageIds.forEach((id) => selectedSet.add(id))
      setSelectedGames([
        ...selectedGames,
        ...tableData.filter((game) => currentPageIds.includes(game._id)),
      ])
    }

    onSelectedChange(selectedSet)
  }, [
    currentPageIds,
    allCurrentPageSelected,
    selectedGameIds,
    selectedGames,
    tableData,
    onSelectedChange,
    setSelectedGames,
  ])

  // Provider options
  const providerOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Providers' },
      ...providers.map((provider) => ({
        value: provider.code,
        label: provider.name,
      })),
    ]
  }, [providers])

  // Effects
  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  // Initial data fetch on mount only
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-2'>
        <Label className='mb-0'>Available Games</Label>
        <div className='flex items-center gap-2'>
          <div className='w-48'>
            <Select
              options={providerOptions}
              placeholder='Select Provider'
              onChange={handleProviderChange}
              value={selectedProvider}
              className='w-full'
            />
          </div>
          <InputSearch fetchData={handleSearch} />
        </div>
      </div>

      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto'>
          <Table>
            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
              <TableRow>
                <TableCell className='text-theme-sm w-10 px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                  <div className='relative inline-block'>
                    <Checkbox
                      checked={!isLoading && allCurrentPageSelected}
                      onChange={handleSelectAll}
                    />
                  </div>
                </TableCell>
                <TableCell
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  isHeader
                />
                <TableCell
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  isHeader
                >
                  Name
                </TableCell>
                <TableCell
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  isHeader
                >
                  Type
                </TableCell>
                <TableCell
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  isHeader
                >
                  Provider Code
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {tableData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        <div className='relative inline-block'>
                          <Checkbox
                            checked={selectedGameIds.has(row._id)}
                            onChange={() => handleSelect(row._id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className='text-theme-sm w-[10%] px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        <div className='flex items-center justify-center gap-3'>
                          <div className='overflow-hidden rounded-full'>
                            <Image
                              width={50}
                              height={50}
                              src={row.banner}
                              alt={row.game_name}
                              className='!h-[50px] !w-[50px]'
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-theme-sm w-[20%] px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        <p>{row.game_name}</p>
                      </TableCell>
                      <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 capitalize dark:text-gray-400'>
                        {row.type}
                      </TableCell>
                      <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        {row.provider_code}
                      </TableCell>
                    </TableRow>
                  ))}
                  {tableData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No record found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
              className='mb-5 justify-center'
            />
          )}
        </div>
      </div>
    </div>
  )
}
