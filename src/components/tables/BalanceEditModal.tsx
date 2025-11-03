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
  const [balance, setBalance] = useState<string>(currentBalance.toString())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setBalance(currentBalance.toString())
      setError('')
    }
  }, [isOpen, currentBalance])

  const handleSave = async () => {
    const balanceValue = parseFloat(balance)

    if (isNaN(balanceValue)) {
      setError('Please enter a valid number')
      return
    }

    if (balanceValue < 0) {
      setError('Balance cannot be negative')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onSave(balanceValue)
      onClose()
    } catch (error) {
      console.error('Error updating balance:', error)
      setError('Failed to update balance. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string, numbers, and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBalance(value)
      setError('')
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
          Edit Balance
        </h4>
        <p className='mb-6 text-sm leading-6 text-gray-500 dark:text-gray-400'>
          Update balance for user:{' '}
          <span className='font-medium'>{username}</span>
        </p>

        <div className='mb-6'>
          <Label htmlFor='balance'>Balance</Label>
          <Input
            type='number'
            id='balance'
            name='balance'
            value={balance}
            onChange={handleBalanceChange}
            placeholder='0.00'
            step={0.1}
            min='0'
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
