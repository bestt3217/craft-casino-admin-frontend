'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getBonusDetail } from '@/api/bonus'

import { BonusEligibility, BonusStatus, BonusType } from '@/lib/bonus'

import ComponentCard from '@/components/common/ComponentCard'
import ImageModal from '@/components/common/ImageModal'
import Loading from '@/components/common/Loading'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'

import { PencilIcon } from '@/icons'

import { Bonus, BonusDetailResponse } from '@/types/bonus'

interface BonusDetailPageProps {
  bonusId: string
}

const BonusDetailPage: React.FC<BonusDetailPageProps> = ({ bonusId }) => {
  const [bonusData, setBonusData] = useState<BonusDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    imageUrl: string
    title: string
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  })
  const router = useRouter()

  useEffect(() => {
    const loadBonusData = async () => {
      try {
        const response = await getBonusDetail(bonusId)
        setBonusData(response)
      } catch (error) {
        console.error('Error loading bonus data:', error)
        toast.error('Failed to load bonus data')
        router.push('/bonus')
      } finally {
        setIsLoading(false)
      }
    }

    if (bonusId) {
      loadBonusData()
    }
  }, [bonusId, router])

  const handleEdit = () => {
    router.push(`/bonus/${bonusId}/edit`)
  }

  const handleBack = () => {
    router.push('/bonus')
  }

  const handleImageModalClose = () => {
    setImageModal({
      isOpen: false,
      imageUrl: '',
      title: '',
    })
  }

  const handleImageClick = (imageUrl: string, bonusName: string) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      title: `${bonusName} Banner`,
    })
  }

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
        eligibility === BonusEligibility.UTM ? 'UTM Marketing' : 'All Users',
      color: getEligibilityBadgeColor(eligibility),
      description:
        eligibility === BonusEligibility.UTM
          ? 'This bonus is designed for marketing campaigns and UTM tracking'
          : 'This bonus is available to all users',
    }
  }

  const getRewardDisplay = (bonus: Bonus) => {
    const reward = bonus.defaultReward
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
        displayText = `Fixed ${reward.cash.amount}`
      }
    }

    // Handle cash rewards
    if (reward?.bonus) {
      if (reward.bonus.percentage) {
        displayText = `${reward.bonus.percentage}%`
        if (reward.bonus.minAmount && reward.cash.maxAmount) {
          displayText += ` of ${reward.cash.minAmount} - ${reward.cash.maxAmount}`
        } else if (reward.bonus.minAmount) {
          displayText += ` of ${reward.bonus.minAmount}`
        } else if (reward.bonus.maxAmount) {
          displayText += ` of ${reward.bonus.maxAmount}`
        }
      } else if (reward.bonus.amount) {
        displayText = `Fixed ${reward.bonus.amount}`
      }
    }

    // Handle free spins
    if (reward?.freeSpins?.amount) {
      const freeSpinsText = `${reward.freeSpins.amount} Free Spins`
      displayText = displayText
        ? `${displayText} + ${freeSpinsText}`
        : freeSpinsText
    }

    return displayText || 'No reward configured'
  }

  if (isLoading) {
    return <Loading />
  }

  if (!bonusData) {
    return (
      <div className='py-8 text-center'>
        <p className='text-gray-500 dark:text-gray-400'>Bonus not found</p>
        <Button onClick={handleBack} className='mt-4'>
          Back to Bonuses
        </Button>
      </div>
    )
  }

  const { bonus } = bonusData

  return (
    <div className='mx-auto max-w-6xl'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='outline' size='sm' onClick={handleBack}>
            ← Back
          </Button>
          <div className='flex items-center space-x-4'>
            {bonus.imageUrl && (
              <div className='relative h-16 w-32 cursor-pointer overflow-hidden rounded-lg hover:opacity-80'>
                <Image
                  src={bonus.imageUrl}
                  alt={`${bonus.name} banner`}
                  fill
                  className='object-cover'
                  onClick={() => handleImageClick(bonus.imageUrl, bonus.name)}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  unoptimized
                />
              </div>
            )}
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {bonus.name}
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {bonus.description}
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Badge size='sm' color={getBadgeColor(bonus.status)}>
            <span className='capitalize'>{bonus.status}</span>
          </Badge>
          <Badge size='sm' color={getEligibilityDisplay(bonus).color}>
            {getEligibilityDisplay(bonus).text}
          </Badge>
          <Button onClick={handleEdit} size='sm'>
            <PencilIcon />
            Edit
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        {/* Basic Information */}
        <ComponentCard title='Basic Information'>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Bonus Name
              </label>
              <p className='text-sm text-gray-900 dark:text-white'>
                {bonus.name}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Bonus Description
              </label>
              <p className='text-sm text-gray-900 dark:text-white'>
                {bonus.description}
              </p>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Bonus Type
              </label>
              <p className='text-sm text-gray-900 dark:text-white'>
                {getBonusTypeDisplay(bonus.type)}
              </p>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Eligibility
              </label>
              <div className='flex items-center space-x-2'>
                <Badge size='sm' color={getEligibilityDisplay(bonus).color}>
                  {getEligibilityDisplay(bonus).text}
                </Badge>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {getEligibilityDisplay(bonus).description}
                </p>
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Reward
              </label>
              <p className='text-sm text-gray-900 dark:text-white'>
                {getRewardDisplay(bonus)}
              </p>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Wagering Multiplier
              </label>
              <p className='text-sm text-gray-900 dark:text-white'>
                {bonus.defaultWageringMultiplier}x
              </p>
            </div>

            {/* <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Claim Method
              </label>
              <p className='text-sm text-gray-900 capitalize dark:text-white'>
                {bonus.claimMethod}
              </p>
            </div> */}
          </div>
        </ComponentCard>
      </div>

      {/* Banner Information */}
      {bonus.imageUrl && (
        <ComponentCard title='Bonus Banner' className='mt-6'>
          <div className='flex items-center space-x-4'>
            <div className='relative h-32 w-64 cursor-pointer overflow-hidden rounded-lg hover:opacity-80'>
              <Image
                src={bonus.imageUrl}
                alt={`${bonus.name} banner`}
                fill
                className='object-cover'
                onClick={() => handleImageClick(bonus.imageUrl, bonus.name)}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
                unoptimized
              />
            </div>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Banner image for this bonus campaign
              </p>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-500'>
                Recommended size: 400x200px
              </p>
              <p className='mt-1 text-xs text-blue-600 dark:text-blue-400'>
                Click the image to view in full size
              </p>
            </div>
          </div>
        </ComponentCard>
      )}

      {/* Terms and Conditions */}
      {bonus.termsAndConditions && (
        <ComponentCard title='Terms and Conditions' className='mt-6'>
          <p className='text-sm whitespace-pre-wrap text-gray-900 dark:text-white'>
            {bonus.termsAndConditions}
          </p>
        </ComponentCard>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={handleImageModalClose}
        imageUrl={imageModal.imageUrl}
        alt='Bonus banner'
        title={imageModal.title}
      />
    </div>
  )
}

export default BonusDetailPage
