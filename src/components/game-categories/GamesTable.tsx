'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { getGamesList } from '@/api/casino'

import { InputSearch } from '@/components/common/InputSearch'
import Loading from '@/components/common/Loading'
import Checkbox from '@/components/form/input/Checkbox'
import Label from '@/components/form/Label'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ICasino } from '@/types/casino'

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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tableData, setTableData] = useState<ICasino[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>('')

  const fetchData = async (params?: { page?: number; search?: string }) => {
    try {
      setIsLoading(true)
      const response = await getGamesList({
        limit,
        page: params?.page ?? page,
        filter: params?.search ?? search,
      })
      setTableData(response.rows)
      setTotalPages(response.totalPages)
      setPage(response.currentPage)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    fetchData({ search: value, page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPage(page)
    fetchData({ page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedGameIds)
    if (selectedGameIds.has(id)) {
      newSelected.delete(id)
      setSelectedGames(selectedGames.filter((game) => game._id !== id))
    } else {
      newSelected.add(id)
      setSelectedGames([
        ...selectedGames,
        tableData.find((game) => game._id === id),
      ])
    }
    onSelectedChange(newSelected)
  }

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

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-2'>
        <Label className='mb-0'>Available Games</Label>
        <InputSearch fetchData={handleSearch} />
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
