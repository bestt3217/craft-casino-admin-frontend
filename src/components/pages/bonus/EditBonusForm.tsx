'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getBonusDetail, updateBonus } from '@/api/bonus'

import {
  BonusEligibility,
  bonusFormSchema,
  BonusFormValues,
  BonusStatus,
  BonusType,
  bonusTypeOptions,
  eligibilityOptions,
  statusOptions,
} from '@/lib/bonus'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'

import ImageUpload from './ImageUpload'
import FreespinConfig from './reward-config/FreespinConfig'
import RealMoneyConfig from './reward-config/RealMoneyConfig'

import { ICasinoGame } from '@/types/game'

interface EditBonusFormProps {
  bonusId: string
  onSuccess?: (bonusId: string) => void
}

const EditBonusForm: React.FC<EditBonusFormProps> = ({
  bonusId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedBonusType, setSelectedBonusType] = useState<BonusType>(
    BonusType.WELCOME
  )
  const [game, setGame] = useState<ICasinoGame | null>(null)
  const router = useRouter()

  const methods = useForm<BonusFormValues>({
    resolver: zodResolver(bonusFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: BonusType.WELCOME,
      status: BonusStatus.DRAFT,
      eligibility: BonusEligibility.ALL,
      rewardType: 'real-money',
      defaultWageringMultiplier: 35,
      cash: {
        type: 'percentage',
        percentage: 100,
        fixedAmount: 0,
        maxAmount: 500,
      },
      freeSpins: {
        amount: 50,
        gameId: '',
        expiry: '7',
      },
      bannerImage: '',
    },
  })

  const { handleSubmit, setValue, reset, control, trigger } = methods

  // Load bonus data
  useEffect(() => {
    const loadBonusData = async () => {
      try {
        const response = await getBonusDetail(bonusId)
        const { bonus } = response

        // Determine reward type from bonus data based on actual backend structure
        let rewardType = 'real-money'
        if (bonus.defaultReward?.freeSpins?.amount > 0) {
          rewardType = 'free-spins'
        }

        // Extract reward data - handle both possible backend structures
        const defaultReward = bonus.defaultReward || {}

        // Prepare form data with proper backend data mapping
        const formData: BonusFormValues = {
          name: bonus.name || '',
          description: bonus.description || '',
          type: bonus.type,
          status: bonus.status,
          eligibility: bonus.metadata?.eligibility || BonusEligibility.ALL,
          rewardType: rewardType as any,
          defaultWageringMultiplier: bonus.defaultWageringMultiplier || 35,
          cash: {
            type: 'percentage',
            percentage: defaultReward.cash?.percentage || 100,
            fixedAmount: defaultReward.cash?.amount || 0,
            maxAmount: defaultReward.cash?.maxAmount || 0,
          },
          freeSpins: {
            amount: defaultReward.freeSpins?.amount || 50,
            gameId: defaultReward.freeSpins?.gameId || '',
            expiry: String(defaultReward.freeSpins?.expiry || '7'),
          },
          bannerImage: bonus.imageUrl || '',
        }
        setGame(bonus.game || null)
        reset(formData)
        setSelectedBonusType(bonus.type)

        // Trigger validation after reset to ensure form is valid
        setTimeout(() => {
          trigger()
        }, 100)
      } catch (error) {
        console.error('Error loading bonus data:', error)
        toast.error('Failed to load bonus data')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (bonusId) {
      loadBonusData()
    }
  }, [bonusId, reset, trigger])

  const onSubmit = async (data: BonusFormValues) => {
    setIsLoading(true)
    try {
      // Prepare reward data based on selected rewardType
      let rewardData = {}

      if (data.rewardType === 'real-money') {
        rewardData = {
          cash: data.cash,
        }
      } else if (data.rewardType === 'free-spins') {
        rewardData = {
          freeSpins: data.freeSpins,
        }
      }

      // Prepare the data to send to backend
      const {
        type,
        eligibility: _eligibility,
        cash: _cash,
        freeSpins: _freeSpins,
        bannerImage,
        ...basicData
      } = data
      const bonusData = {
        ...basicData,
        imageUrl: bannerImage, // Map bannerImage to imageUrl for backend
        defaultReward: rewardData,
        type,
        // Add depositCount for deposit type bonuses
        metadata: {
          ...(type === BonusType.DEPOSIT && { depositCount: 1 }),
          eligibility: data.eligibility,
        },
      }

      const response = await updateBonus(bonusId, { bonusData })

      if (response?.success) {
        toast.success('Bonus updated successfully!')
        if (onSuccess) {
          onSuccess(response.bonus._id)
        } else {
          router.push(`/bonus/${response.bonus._id}`)
        }
      }
    } catch (error) {
      console.error('Error updating bonus:', error)
      toast.error(error.message || 'Failed to update bonus')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBonusTypeChange = (type: BonusType) => {
    setSelectedBonusType(type)
    setValue('type', type)

    // Set default reward type based on bonus type
    if (type === BonusType.WELCOME) {
      setValue('rewardType', 'free-spins')
    } else if (type === BonusType.DEPOSIT) {
      setValue('rewardType', 'real-money')
    }
  }

  const getRewardTypeOptions = () => {
    if (selectedBonusType === BonusType.WELCOME) {
      return [
        { label: 'Free Spins', value: 'free-spins' },
        { label: 'Real Money', value: 'real-money' },
      ]
    } else if (selectedBonusType === BonusType.DEPOSIT) {
      return [
        { label: 'Real Money', value: 'real-money' },
        { label: 'Free Spins', value: 'free-spins' },
      ]
    }
    return [
      { label: 'Real Money', value: 'real-money' },
      { label: 'Free Spins', value: 'free-spins' },
    ]
  }

  if (isLoadingData) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Basic Information */}
        <ComponentCard title='Basic Information'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label>Bonus Title</Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    name='name'
                    type='text'
                    placeholder='Enter bonus title'
                  />
                )}
              />
            </div>

            <div>
              <Label>Bonus Type</Label>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    options={bonusTypeOptions}
                    placeholder='Select bonus type'
                    onChange={(value) =>
                      handleBonusTypeChange(value as BonusType)
                    }
                  />
                )}
              />
            </div>
            <div>
              <Label>Bonus Description</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder='Enter bonus description'
                    rows={3}
                  />
                )}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    options={statusOptions}
                    placeholder='Select status'
                    onChange={(value) => field.onChange(value as BonusStatus)}
                  />
                )}
              />
            </div>
            <div>
              <Label>Eligibility</Label>
              <Controller
                name='eligibility'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    options={eligibilityOptions}
                    placeholder='Select eligibility'
                    onChange={(value) =>
                      field.onChange(value as BonusEligibility)
                    }
                  />
                )}
              />
            </div>

            <div className='md:col-span-2'>
              <ImageUpload
                name='bannerImage'
                label='Bonus Banner'
                description='Upload an image for the bonus banner (recommended: 400x200px)'
              />
            </div>
          </div>
        </ComponentCard>

        {/* Reward Configuration */}
        <ComponentCard title='Reward Configuration'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label>Reward Type</Label>
              <Controller
                name='rewardType'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    options={getRewardTypeOptions()}
                    placeholder='Select reward type'
                  />
                )}
              />
            </div>
            <div>
              <Label>Wagering Multiplier</Label>
              <Controller
                name='defaultWageringMultiplier'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type='number'
                    placeholder='Enter wagering multiplier'
                  />
                )}
              />
            </div>
          </div>

          {/* Conditional reward configurations */}
          <div className='mt-6'>
            <FreespinConfig game={game} control={control} />
            <RealMoneyConfig control={control} />
          </div>
        </ComponentCard>

        {/* Submit Button */}
        <div className='flex justify-end space-x-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Bonus'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default EditBonusForm
