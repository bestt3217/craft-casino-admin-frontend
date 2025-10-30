'use client'

import moment from 'moment'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteGameCategory, getGameCategories } from '@/api/game-category'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PencilIcon, TrashBinIcon } from '@/icons'

import { ICategory } from '@/types/game-category'

export default function GameCategoriesList() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [tableData, setTableData] = useState<ICategory[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = async (params?: { page?: number; search?: string }) => {
    try {
      setIsLoading(true)
      const response = await getGameCategories({
        limit,
        page: params?.page ?? page,
      })
      setTableData(response.data)
      setTotalPages(response.total)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPage(page)
    fetchData({ page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = useCallback(() => setDeleteId(null), [])

  const handleDelete = async () => {
    if (!deleteId || isDeleting) return

    setIsDeleting(true)
    try {
      await deleteGameCategory(deleteId)
      fetchData()
      setDeleteId(null)
      toast.success('Game category deleted successfully')
    } catch (error) {
      console.error('Error deleting game category:', error)
      toast.error('Failed to delete game category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
            <Table>
              <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                <TableRow>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Title
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Modified At
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Action
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
                        <TableCell className='text-theme-sm w-[20%] px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <p>{row.title}</p>
                        </TableCell>
                        <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                        </TableCell>
                        <TableCell className='flex items-center justify-center gap-1 px-5 py-3'>
                          <Link
                            href={`/games/categories/${row._id}`}
                            className='text-brand-500'
                          >
                            <PencilIcon />
                          </Link>
                          <button
                            className='cursor-pointer text-red-500'
                            onClick={() => setDeleteId(row._id)}
                          >
                            <TrashBinIcon />
                          </button>
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

      <ConfirmModal
        open={!!deleteId}
        title='Are you Sure?'
        description='You can not restore deleted record.'
        handleConfirm={handleDelete}
        handleClose={handleClose}
      />
    </>
  )
}
