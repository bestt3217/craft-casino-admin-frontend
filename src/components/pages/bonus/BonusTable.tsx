'use client'
import { formatDate } from '@fullcalendar/core/index.js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteBonus } from '@/api/bonus'

import { useI18n } from '@/context/I18nContext'

import {
  BonusEligibility,
  BonusStatus,
  BonusType,
  ClaimMethod,
} from '@/lib/bonus'

import ConfirmModal from '@/components/common/ConfirmModal'
import ImageModal from '@/components/common/ImageModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PencilIcon, TrashBinIcon } from '@/icons'

import { Bonus } from '@/types/bonus'
import { ITierData } from '@/types/tier'

type BonusTableProps = {
  bonuses: Bonus[]
  totalPages: number
  page: number
  loyaltyTiers: ITierData[]
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchBonuses: () => void
  onEdit: (bonus: Bonus) => void
}

export default function BonusTable({
  bonuses,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchBonuses,
  onEdit,
}: BonusTableProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    imageUrl: string
    title: string
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  })

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleImageModalClose = useCallback(() => {
    setImageModal({
      isOpen: false,
      imageUrl: '',
      title: '',
    })
  }, [])

  const handleImageClick = useCallback(
    (imageUrl: string, bonusName: string) => {
      setImageModal({
        isOpen: true,
        imageUrl,
        title: `${bonusName} ${t('bonus.banner')}`,
      })
    },
    [t]
  )

  const handleBonusClick = useCallback(
    (bonusId: string) => {
      router.push(`/bonus/${bonusId}`)
    },
    [router]
  )

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteBonus(id)
      if (res.message) {
        toast.success(t('bonus.bonusDeletedSuccessfully'))
        fetchBonuses()
      }
    } catch (error) {
      console.error('Error deleting bonus:', error)
      toast.error(error.message || t('bonus.errorDeletingBonus'))
    } finally {
      setIsLoading(false)
      setDeleteId(null)
      setOpenConfirm(false)
    }
  }

  // Function to get badge color based on bonus status
  const getBadgeColor = (status: BonusStatus) => {
    switch (status) {
      case BonusStatus.ACTIVE:
        return 'success'
      case BonusStatus.DRAFT:
        return 'warning'
      case BonusStatus.EXPIRED:
        return 'error'
      case BonusStatus.INACTIVE:
        return 'error'
      default:
        return 'primary'
    }
  }

  // Function to get bonus type display name
  const getBonusTypeDisplay = (type: BonusType) => {
    return (
      type.charAt(0).toUpperCase() +
      type.slice(1).toLowerCase().replace(/_/g, ' ')
    )
  }

  // Function to get eligibility badge color
  const getEligibilityBadgeColor = (
    eligibility: string
  ): 'warning' | 'success' | 'primary' => {
    switch (eligibility) {
      case BonusEligibility.UTM:
        return 'warning' // Orange/yellow for marketing
      case BonusEligibility.ALL:
        return 'success' // Green for all users
      default:
        return 'primary'
    }
  }

  // Function to get eligibility display text
  const getEligibilityDisplay = (bonus: Bonus) => {
    const eligibility = bonus.metadata?.eligibility || BonusEligibility.ALL
    return {
      text:
        eligibility === BonusEligibility.UTM
          ? t('bonus.utmMarketing')
          : t('bonus.allUsers'),
      color: getEligibilityBadgeColor(eligibility),
    }
  }

  const getAmount = useCallback(
    (bonus: Bonus) => {
      const reward = bonus?.defaultReward
      let displayText = ''

      // Handle cash rewards
      if (reward?.cash) {
        if (reward.cash.percentage) {
          displayText = `${reward.cash.percentage}%`
          if (reward.cash.minAmount && reward.cash.maxAmount) {
            displayText += ` of ${reward.cash.minAmount} - ${reward.cash.maxAmount}`
          } else if (reward.cash.minAmount) {
            displayText += ` of ${reward.cash.minAmount}`
          } else if (reward.cash.maxAmount) {
            displayText += ` of ${reward.cash.maxAmount}`
          }
        } else if (reward.cash.amount) {
          displayText = `${t('bonus.fixed')} ${reward.cash.amount}`
        } else if (reward.cash.minAmount && reward.cash.maxAmount) {
          if (reward.cash.minAmount === reward.cash.maxAmount) {
            displayText = `${t('bonus.fixed')} ${reward.cash.minAmount}`
          } else {
            displayText = `${t('bonus.random')} ${reward.cash.minAmount} - ${reward.cash.maxAmount}`
          }
        }
      }

      // Handle free spins
      if (reward?.freeSpins) {
        const freeSpinsText = reward.freeSpins.amount
          ? `${reward.freeSpins.amount} ${t('bonus.freeSpins')}`
          : reward.freeSpins.percentage
            ? `${reward.freeSpins.percentage}% ${t('bonus.freeSpins')}`
            : ''
        if (freeSpinsText) {
          displayText = displayText
            ? `${displayText} + ${freeSpinsText}`
            : freeSpinsText
        }
      }

      // Handle bonus rewards
      if (reward?.bonus) {
        const bonusText = reward.bonus.amount
          ? `${reward.bonus.amount} ${t('bonus.bonus')}`
          : reward.bonus.percentage
            ? `${reward.bonus.percentage}% ${t('bonus.bonus')}`
            : ''
        if (bonusText) {
          displayText = displayText
            ? `${displayText} + ${bonusText}`
            : bonusText
        }
      }

      return displayText || t('common.na')
    },
    [t]
  )

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <div className='min-w-[1102px]'>
                <Table>
                  {/* Table Header */}
                  <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                    <TableRow>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.title')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.type')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.amount')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.eligibility')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.banner')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.claimMethod')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.validFrom')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.validTo')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.status')}
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        {t('bonus.actions')}
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                    {bonuses &&
                      bonuses.length > 0 &&
                      bonuses.map((bonus) => (
                        <TableRow key={bonus._id}>
                          <TableCell
                            className='text-theme-sm hover:text-brand-500 dark:hover:text-brand-500 cursor-pointer px-4 py-3 text-left text-gray-500 dark:text-gray-400'
                            onClick={() => handleBonusClick(bonus._id)}
                          >
                            {bonus.name}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                            {getBonusTypeDisplay(bonus.type)}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                            {getAmount(bonus)}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            <Badge
                              size='sm'
                              color={getEligibilityDisplay(bonus).color}
                            >
                              {getEligibilityDisplay(bonus).text}
                            </Badge>
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {bonus.imageUrl ? (
                              <div className='relative h-8 w-12 cursor-pointer overflow-hidden rounded hover:opacity-80'>
                                <Image
                                  src={bonus.imageUrl}
                                  alt={`${bonus.name} banner`}
                                  fill
                                  className='object-cover'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleImageClick(bonus.imageUrl, bonus.name)
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <span className='text-xs text-gray-400'>
                                {t('bonus.noImage')}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {bonus.claimMethod}
                            {bonus.claimMethod === ClaimMethod.CODE &&
                              bonus.code && (
                                <span className='ml-1 text-xs font-medium text-gray-400'>
                                  ({bonus.code})
                                </span>
                              )}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {bonus.validFrom
                              ? formatDate(bonus.validFrom)
                              : t('common.na')}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {bonus.validTo
                              ? formatDate(bonus.validTo)
                              : t('bonus.noExpiry')}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <Badge
                              size='sm'
                              color={getBadgeColor(bonus.status)}
                            >
                              <span className='capitalize'>
                                {t(`bonus.${bonus.status.toLowerCase()}`)}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center justify-center gap-2'>
                              <a
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => {
                                  onEdit(bonus)
                                }}
                              >
                                <PencilIcon />
                              </a>
                              <a
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => {
                                  setDeleteId(bonus._id)
                                  setOpenConfirm(true)
                                }}
                              >
                                <TrashBinIcon />
                              </a>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                    {bonuses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            {t('bonus.noBonusesFound')}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  className='mb-5 justify-center'
                />
              )}
            </div>
            <ConfirmModal
              open={openConfirm}
              title={t('common.areYouSure')}
              description={t('bonus.cannotRestoreDeletedBonus')}
              handleConfirm={() => handleDelete(deleteId)}
              handleClose={handleClose}
            />
            <ImageModal
              isOpen={imageModal.isOpen}
              onClose={handleImageModalClose}
              imageUrl={imageModal.imageUrl}
              alt='Bonus banner'
              title={imageModal.title}
            />
          </div>
        </>
      )}
    </>
  )
}
