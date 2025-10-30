'use client'

import { PenIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Control, Controller, useFormContext } from 'react-hook-form'

import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import GameListModal from '@/components/pages/bonus/GameListModal'

import { ICasinoGame } from '@/types/game'

interface FreespinConfigProps {
  isVisible?: boolean
  control: Control<any>
  game: ICasinoGame | null
}

const FreespinConfig: React.FC<FreespinConfigProps> = ({ control, game }) => {
  const { watch, setValue, formState } = useFormContext()
  const rewardType = watch('rewardType')
  const [isOpenGameModal, setIsOpenGameModal] = useState(false)

  // Get validation errors for gameId field
  const gameIdError =
    formState.errors?.freeSpins && 'gameId' in formState.errors.freeSpins
      ? (formState.errors.freeSpins as any).gameId?.message
      : undefined

  if (rewardType !== 'free-spins') {
    return null
  }

  const openModal = () => {
    setIsOpenGameModal(true)
  }

  return (
    <>
      <ComponentCard title='Free Spins Configuration'>
        <div className='mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20'>
          <p className='text-sm text-blue-800 dark:text-blue-200'>
            <strong>Note:</strong> You must select a game for the free spins.
            Click the pencil icon to choose from available games.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label>Free Spins Amount</Label>
            <Controller
              name='freeSpins.amount'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter number of free spins'
                />
              )}
            />
          </div>
          <div>
            <Label>Game ID *</Label>
            <Controller
              name='freeSpins.gameId'
              control={control}
              render={({ field }) => (
                <div>
                  <div className='flex items-center gap-2'>
                    <Input
                      {...field}
                      type='text'
                      rootClassName='w-full'
                      disabled
                      placeholder='Select a game for free spins'
                      className={gameIdError ? 'border-red-500' : ''}
                    />
                    <button
                      type='button'
                      onClick={openModal}
                      className='hover:text-brand-600 text-gray-500'
                    >
                      <PenIcon size={16} />
                    </button>
                  </div>
                  {gameIdError && (
                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                      {gameIdError}
                    </p>
                  )}
                  {!gameIdError && field.value && (
                    <p className='mt-1 text-sm text-green-600 dark:text-green-400'>
                      ✓ Game selected
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Label>Free Spins Expiry</Label>
            <Controller
              name='freeSpins.expiry'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || '7'}
                  options={[
                    { label: '7 days', value: '7' },
                    { label: '14 days', value: '14' },
                    { label: '30 days', value: '30' },
                  ]}
                  placeholder='Select expiry period'
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </div>
        </div>
      </ComponentCard>
      <GameListModal
        selectedGame={game}
        isOpen={isOpenGameModal}
        onClose={() => setIsOpenGameModal(false)}
        onGameSelect={(gameId) => {
          setValue('freeSpins.gameId', gameId, {
            shouldValidate: true,
            shouldDirty: true,
          })
          setIsOpenGameModal(false)
        }}
      />
    </>
  )
}

export default FreespinConfig
