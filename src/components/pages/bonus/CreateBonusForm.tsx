'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createBonus } from '@/api/bonus'

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

interface CreateBonusFormProps {
  onSuccess?: (bonusId: string) => void
}

const CreateBonusForm: React.FC<CreateBonusFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBonusType, setSelectedBonusType] = useState<BonusType>(
    BonusType.WELCOME
  )
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
      bannerImage: '',
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
    },
  })

  const { handleSubmit, setValue, control } = methods

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
        bannerImage,
        cash: _cash,
        eligibility: _eligibility,
        freeSpins: _freeSpins,
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

      const response = await createBonus({
        bonusData,
        bonusType: type,
      })

      if (response?.success) {
        toast.success('Bonus created successfully!')
        if (onSuccess) {
          onSuccess(response.bonus._id)
        } else {
          router.push(`/bonus/${response.bonus._id}`)
        }
      }
    } catch (error) {
      console.error('Error creating bonus:', error)
      toast.error(error.message || 'Failed to create bonus')
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

  if (isLoading) {
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
            <FreespinConfig game={null} control={control} />
            <RealMoneyConfig control={control} />
          </div>
        </ComponentCard>

        {/* Submit Button */}
        <div className='flex justify-end space-x-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Bonus'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default CreateBonusForm
