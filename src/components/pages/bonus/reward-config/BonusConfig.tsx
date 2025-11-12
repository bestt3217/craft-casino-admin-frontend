'use client'

import React from 'react'
import { Control, Controller, useFormContext } from 'react-hook-form'

import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'

interface BonusConfigProps {
  control: Control<any>
}

const BonusConfig: React.FC<BonusConfigProps> = ({ control }) => {
  const { watch } = useFormContext()
  const rewardType = watch('rewardType')
  const type = watch('type')
  const bonusType = watch('bonus.type')

  if (!['bonus'].includes(rewardType)) {
    return null
  }

  return (
    <ComponentCard title='Real Money Configuration'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <Label>Reward Type</Label>
          <Controller
            name='bonus.type'
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

        {type === 'deposit' && (
          <div>
            <Label>Deposit Count</Label>
            <Controller
              name='bonus.depositCount'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                  options={[
                    { label: 'All', value: 0 },
                    { label: 'First Deposit', value: 1 },
                    { label: 'Second Deposit', value: 2 },
                    { label: 'Third Deposit', value: 3 },
                    { label: 'Fourth Deposit', value: 4 },
                    { label: 'Fifth Deposit', value: 5 },
                  ]}
                  placeholder='Select deposit count'
                />
              )}
            />
          </div>
        )}

        {bonusType === 'percentage' && (
          <div>
            <Label>Percentage (%)</Label>
            <Controller
              name='bonus.percentage'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  type='number'
                  placeholder='Enter percentage'
                />
              )}
            />
          </div>
        )}
        {bonusType === 'fixed' && (
          <div>
            <Label>Fixed Amount</Label>
            <Controller
              name='bonus.fixedAmount'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  type='number'
                  placeholder='Enter fixed amount'
                />
              )}
            />
          </div>
        )}
        <div>
          <Label>Maximum Amount</Label>
          <Controller
            name='bonus.maxAmount'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                type='number'
                placeholder='Enter maximum amount'
              />
            )}
          />
        </div>
      </div>
    </ComponentCard>
  )
}

export default BonusConfig
