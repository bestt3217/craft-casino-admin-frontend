'use client'
import React, { useEffect, useState } from 'react'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

interface BalanceEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
  username: string
  onSave: (balance: number) => Promise<void>
}

export default function BalanceEditModal({
  isOpen,
  onClose,
  currentBalance,
  username,
  onSave,
}: BalanceEditModalProps) {
  const [balance, setBalance] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setBalance('')
      setError('')
    }
  }, [isOpen])

  const inputBalance = parseFloat(balance) || 0
  const totalBalance = currentBalance + inputBalance

  const handleSave = async () => {
    const value = parseFloat(balance)

    if (isNaN(value)) {
      setError('Please enter a valid number')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onSave(value)
      onClose()
    } catch (error) {
      console.error('Error adding balance:', error)
      setError('Failed to add balance. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-[507px] p-6 lg:p-10'
    >
      <div>
        <h4 className='sm:text-title-sm mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
          Add Balance
        </h4>
        <p className='mb-6 text-sm leading-6 text-gray-500 dark:text-gray-400'>
          Add balance for user: <span className='font-medium'>{username}</span>
        </p>

        <div className='mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              Current Balance:
            </span>
            <span className='text-lg font-semibold text-gray-900 dark:text-white'>
              {currentBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className='flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700'>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              Total Balance:
            </span>
            <span className='text-lg font-semibold text-gray-900 dark:text-white'>
              {totalBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className='mb-6'>
          <Label htmlFor='balance'>Amount to Add</Label>
          <Input
            type='number'
            id='balance'
            name='balance'
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder='0.00'
            step={0.1}
            error={!!error}
            errorMessage={error}
            disabled={isLoading}
          />
        </div>

        <div className='flex w-full items-center justify-end gap-3'>
          <Button
            size='sm'
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button size='sm' onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
