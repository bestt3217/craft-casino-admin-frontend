'use client'

import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getBonuses } from '@/api/bonus'
import { getTiers } from '@/api/tier'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import BonusTable from '@/components/pages/bonus/BonusTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { Bonus } from '@/types/bonus'
import { ITierData } from '@/types/tier'

const BonusManagementPage = () => {
  const [loyaltyTiers, setLoyaltyTiers] = useState<ITierData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const router = useRouter()

  const fetchBonuses = useCallback(async () => {
    try {
      const response = await getBonuses({
        page,
        limit,
        filter: '',
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setBonuses(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching bonuses')
      }
    }
  }, [page, limit])

  const fetchLoyaltyTiers = useCallback(async () => {
    try {
      const response = await getTiers({
        page: 1,
        limit: -1,
      })
      setLoyaltyTiers(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching loyalty tiers')
      }
    }
  }, [])

  const initialLoading = useCallback(async () => {
    await Promise.all([fetchLoyaltyTiers(), fetchBonuses()])
    setIsLoading(false)
  }, [fetchLoyaltyTiers, fetchBonuses])

  const handleOnEdit = (bonus: Bonus) => {
    router.push(`/bonus/${bonus._id}`)
  }

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard
      title='Bonus management'
      action={
        <Button onClick={() => router.push('/bonus/create')} size='xs'>
          <PlusIcon />
          Add Bonus
        </Button>
      }
    >
      <BonusTable
        loyaltyTiers={loyaltyTiers}
        bonuses={bonuses}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        fetchBonuses={fetchBonuses}
        onEdit={handleOnEdit}
      />
    </ComponentCard>
  )
}

export default BonusManagementPage
