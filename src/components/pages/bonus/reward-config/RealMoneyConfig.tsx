'use client'

import React from 'react'
import { Control, Controller, useFormContext } from 'react-hook-form'

import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'

interface RealMoneyConfigProps {
  control: Control<any>
}

const RealMoneyConfig: React.FC<RealMoneyConfigProps> = ({ control }) => {
  const { watch } = useFormContext()
  const rewardType = watch('rewardType')
  const realMoneyType = watch('cash.type')

  if (rewardType !== 'real-money') {
    return null
  }

  return (
    <ComponentCard title='Real Money Configuration'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <Label>Reward Type</Label>
          <Controller
            name='cash.type'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value}
                options={[
                  { label: 'Percentage of Deposit', value: 'percentage' },
                  { label: 'Fixed Amount', value: 'fixed' },
                ]}
                placeholder='Select reward type'
              />
            )}
          />
        </div>
        {realMoneyType === 'percentage' && (
          <div>
            <Label>Percentage (%)</Label>
            <Controller
              name='cash.percentage'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter percentage'
                />
              )}
            />
          </div>
        )}
        {realMoneyType === 'fixed' && (
          <div>
            <Label>Fixed Amount</Label>
            <Controller
              name='cash.fixedAmount'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter fixed amount'
                />
              )}
            />
          </div>
        )}
        {realMoneyType === 'fixed' && (
          <div>
            <Label>Maximum Amount</Label>
            <Controller
              name='cash.maxAmount'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter maximum amount'
                />
              )}
            />
          </div>
        )}
      </div>
    </ComponentCard>
  )
}

export default RealMoneyConfig
