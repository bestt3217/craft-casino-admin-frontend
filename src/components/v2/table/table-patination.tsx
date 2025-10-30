import { Table } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import Button from '@/components/ui/button/Button'

const TablePagination = ({
  pageIndex,
  pageSize,
  pagination,
  table,
}: {
  pageIndex: number
  pageSize: number
  pagination: {
    total: number
    totalPages: number
  }
  table: Table<any>
}) => {
  return (
    <div className='flex flex-col items-center justify-center gap-1 space-x-2 pt-4 md:flex-row md:justify-between'>
      <div className='text-muted-foreground text-xs'>
        Showing {Math.min(pageIndex * pageSize + 1, pagination.total)} to{' '}
        {Math.min((pageIndex + 1) * pageSize, pagination.total)} of{' '}
        {pagination.total} entries
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          className='size-8 !p-0'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft size={16} />
        </Button>
        <Button
          variant='outline'
          className='size-8 !p-0'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={16} />
        </Button>
        <div className='flex items-center gap-1'>
          <span className='text-xs'>
            Page {pageIndex + 1} of {pagination.totalPages || 1}
          </span>
        </div>
        <Button
          variant='outline'
          className='size-8 !p-0'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={16} />
        </Button>
        <Button
          variant='outline'
          className='size-8 !p-0'
          size='sm'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  )
}

export default TablePagination
