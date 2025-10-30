import {
  ColumnDef,
  flexRender,
  Table as TanstackTable,
} from '@tanstack/react-table'

import { Card } from '@/components/ui/card'
import {
  Table as CommonTable,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import TablePagination from './table-patination'

const Table = ({
  table,
  columns,
  loading,
  pagination,
  pageIndex,
  pageSize,
}: {
  table: TanstackTable<any>
  columns: ColumnDef<any>[]
  loading: boolean
  pagination: Pagination
  pageIndex: number
  pageSize: number
}) => {
  return (
    <Card>
      <CommonTable className='border-collapse'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell className='py-2 text-left' isHeader key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 py-2 text-center'
              >
                <div className='flex items-center justify-center'>
                  <div className='border-primary h-6 w-6 animate-spin rounded-full border-b-2'></div>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className='py-2'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </CommonTable>

      <TablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pagination={pagination}
        table={table}
      />
    </Card>
  )
}

export default Table
