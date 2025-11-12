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
  statusOptions,
} from '@/lib/bonus'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import BonusConfig from '@/components/pages/bonus/reward-config/BonusConfig'
import Button from '@/components/ui/button/Button'

import FreespinConfig from './reward-config/FreespinConfig'
import RealMoneyConfig from './reward-config/RealMoneyConfig'

interface CreateBonusFormProps {
  onSuccess?: (bonusId: string) => void
}

const CreateBonusForm: React.FC<CreateBonusFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBonusType, setSelectedBonusType] = useState<BonusType>(
    BonusType.DEPOSIT
  )
  const router = useRouter()

  const methods = useForm<BonusFormValues>({
    resolver: zodResolver(bonusFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: BonusType.DEPOSIT,
      status: BonusStatus.DRAFT,
      eligibility: BonusEligibility.ALL,
      rewardType: 'real-money',
      defaultWageringMultiplier: 0,
      bannerImage: '',
      cash: {
        type: 'percentage',
        percentage: 100,
        fixedAmount: 0,
        maxAmount: 500,
      },
      bonus: {
        type: 'percentage',
        percentage: 100,
        fixedAmount: 0,
        maxAmount: 500,
      },
      // freeSpins: {
      //   amount: 50,
      //   gameId: '',
      //   expiry: '7',
      // },
    },
  })

  const { handleSubmit, setValue, watch, control, formState } = methods
  const watchedRewardType = watch('rewardType')

  const onSubmit = async (data: BonusFormValues) => {
    setIsLoading(true)
    try {
      // Prepare reward data based on selected rewardType
      let rewardData = {}

      let depositCount = null
      if (data.rewardType === 'real-money') {
        rewardData = {
          cash: {
            type: data.cash.type,
            percentage: data.cash.percentage,
            fixedAmount: data.cash.fixedAmount,
            maxAmount: data.cash.maxAmount,
          },
        }
        depositCount = data.cash.depositCount
      } else if (data.rewardType === 'free-spins') {
        rewardData = {
          freeSpins: data.freeSpins,
        }
      } else if (data.rewardType === 'bonus') {
        rewardData = {
          bonus: {
            type: data.bonus.type,
            percentage: data.bonus.percentage,
            fixedAmount: data.bonus.fixedAmount,
            maxAmount: data.bonus.maxAmount,
          },
        }
        depositCount = data.bonus.depositCount
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
          eligibility: data.eligibility,
          ...(type === BonusType.DEPOSIT &&
            depositCount && {
              depositCount,
            }),
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
        { label: 'Bonus', value: 'bonus' },
      ]
    } else if (selectedBonusType === BonusType.DEPOSIT) {
      return [
        { label: 'Real Money', value: 'real-money' },
        { label: 'Bonus', value: 'bonus' },
        // { label: 'Free Spins', value: 'free-spins' },
      ]
    }
    return [
      { label: 'Balance', value: 'real-money' },
      // { label: 'Free Spins', value: 'free-spins' },
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
                    error={!!formState.errors.name}
                    errorMessage={formState.errors.name?.message as string}
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
                    error={!!formState.errors.description}
                    hint={formState.errors.description?.message as string}
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
            {/* <div>
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
            </div> */}

            {/* <div className='md:col-span-2'>
              <ImageUpload
                name='bannerImage'
                label='Bonus Banner'
                description='Upload an image for the bonus banner (recommended: 400x200px)'
              />
            </div> */}
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
                    onChange={(value) => {
                      field.onChange(value)
                      setValue('defaultWageringMultiplier', 0, {
                        shouldDirty: true,
                      })
                    }}
                    options={getRewardTypeOptions()}
                    placeholder='Select reward type'
                  />
                )}
              />
            </div>
            {watchedRewardType === 'bonus' && (
              <div>
                <Label>Wagering Multiplier</Label>
                <Controller
                  name='defaultWageringMultiplier'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onBlur={field.onBlur}
                      error={!!formState.errors.defaultWageringMultiplier}
                      errorMessage={
                        formState.errors.defaultWageringMultiplier
                          ?.message as string
                      }
                      type='number'
                      placeholder='Enter wagering multiplier'
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* Conditional reward configurations */}
          <div className='mt-6'>
            <FreespinConfig game={null} control={control} />
            <RealMoneyConfig control={control} />
            <BonusConfig control={control} />
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
