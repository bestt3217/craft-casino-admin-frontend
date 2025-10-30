'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  createWheelBonus,
  getAllWheelBonuses,
  updateWheelBonus,
} from '@/api/wheelBonus'
import { WheelBonus } from '@/api/wheelBonus'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import WheelBonusSettingModal from '@/components/pages/wheel-bonus/WheelBonusSettingModal'
import WheelBonusTable from '@/components/pages/wheel-bonus/WheelBonusTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

type WheelBonusWithStringStatus = Omit<WheelBonus, 'status'> & {
  status: 'active' | 'inactive'
}

const convertToWheelBonusWithStringStatus = (
  wheelBonus: WheelBonus
): WheelBonusWithStringStatus => ({
  ...wheelBonus,
  status: wheelBonus.status ? 'active' : 'inactive',
})

const convertToWheelBonus = (
  wheelBonus: WheelBonusWithStringStatus
): Omit<WheelBonus, '_id'> => ({
  ...wheelBonus,
  status: wheelBonus.status,
})

const WheelBonusManagementPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [wheelBonuses, setWheelBonuses] = useState<
    WheelBonusWithStringStatus[]
  >([])
  const [selectedWheelBonus, setSelectedWheelBonus] =
    useState<WheelBonusWithStringStatus | null>(null)

  const handleOpenModal = useCallback(() => {
    setOpenModal(true)
    if (selectedWheelBonus) {
      setSelectedWheelBonus(null)
    }
  }, [selectedWheelBonus])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    if (selectedWheelBonus) {
      setSelectedWheelBonus(null)
    }
  }, [selectedWheelBonus])

  const fetchWheelBonuses = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getAllWheelBonuses()
      if (response.success && Array.isArray(response.data)) {
        setWheelBonuses(response.data.map(convertToWheelBonusWithStringStatus))
        setTotalPages(Math.ceil(response.data.length / limit))
      } else {
        toast.error('Failed to fetch wheel bonuses')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching wheel bonuses')
      }
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  const handleOnSubmit = async (
    data: Omit<WheelBonusWithStringStatus, '_id'>
  ) => {
    try {
      setIsLoading(true)
      const convertedData = convertToWheelBonus(data)
      if (selectedWheelBonus) {
        const response = await updateWheelBonus(
          selectedWheelBonus._id,
          convertedData
        )
        if (response.success) {
          toast.success('Wheel bonus updated successfully')
          fetchWheelBonuses()
          return true
        } else {
          toast.error(response.message || 'Failed to update wheel bonus')
          return false
        }
      } else {
        const response = await createWheelBonus(convertedData)
        if (response.success) {
          toast.success('Wheel bonus created successfully')
          fetchWheelBonuses()
          return true
        } else {
          toast.error(response.message || 'Failed to create wheel bonus')
          return false
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error saving wheel bonus')
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnEdit = (wheelBonus: WheelBonusWithStringStatus) => {
    setSelectedWheelBonus(wheelBonus)
    handleOpenModal()
  }

  useEffect(() => {
    fetchWheelBonuses()
  }, [fetchWheelBonuses])

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard
      title='Wheel Bonus Management'
      action={
        <Button onClick={handleOpenModal} size='xs'>
          <PlusIcon />
          Add Wheel Bonus
        </Button>
      }
    >
      <WheelBonusSettingModal
        isOpen={openModal}
        closeModal={handleCloseModal}
        selectedWheelBonus={selectedWheelBonus}
        onSubmit={handleOnSubmit}
      />
      <WheelBonusTable
        wheelBonuses={wheelBonuses}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        fetchWheelBonuses={fetchWheelBonuses}
        onEdit={handleOnEdit}
      />
    </ComponentCard>
  )
}

export default WheelBonusManagementPage
