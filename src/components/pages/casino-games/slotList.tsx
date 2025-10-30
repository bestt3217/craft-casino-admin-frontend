'use client'
import React, { useCallback, useEffect, useState } from 'react'

import { getGamesList } from '@/api/casino'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import SlotsTable from '@/components/tables/SlotsTable'

import { CasinoType, ICasino } from '@/types/casino'

const SlotListPage = () => {
  const [tableData, setTableData] = useState<ICasino[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(1)

  const fetchData = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getGamesList({
          page,
          limit,
          type: CasinoType.SLOT,
          filter: filter || '',
        })
        setTableData(response.rows)
        setTotalPages(response.totalPages)
        setPage(response.currentPage)
      } catch (error) {
        console.error('Error fetching slots:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  useEffect(() => {
    fetchData()
  }, [page, limit, fetchData])

  return (
    <div>
      {/* <PageBreadcrumb pageTitle="Slots Table" /> */}
      <div className='space-y-6'>
        <ComponentCard
          title='Slot Games'
          inputSearchElement={<InputSearch fetchData={fetchData} />}
        >
          <SlotsTable
            type={CasinoType.SLOT}
            tableData={tableData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setTableData={setTableData}
          />
        </ComponentCard>
      </div>
    </div>
  )
}

export default SlotListPage
