'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { changeUserPassword } from '@/api/users'

import { validatePassword } from '@/lib/validate'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
  userId,
  username,
}: PasswordChangeModalProps) {
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setError('')
    }
  }, [isOpen])

  const handleSave = async () => {
    const validationError = validatePassword(password)

    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await changeUserPassword({
        id: userId,
        password,
      })
      if (response.success) {
        toast.success('User password changed successfully')
        onClose()
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      const errorMessage =
        error?.message || 'Failed to change password. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setError('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-[507px] p-6 lg:p-10'
    >
      <div>
        <h4 className='sm:text-title-sm mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
          Change Password
        </h4>
        <p className='mb-6 text-sm leading-6 text-gray-500 dark:text-gray-400'>
          Change password for user:{' '}
          <span className='font-medium'>{username}</span>
        </p>

        <div className='mb-6'>
          <Label htmlFor='change-password-input'>New Password</Label>
          <Input
            type='password'
            id='change-password-input'
            name='new-password'
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter new password'
            error={!!error}
            errorMessage={error}
            disabled={isLoading}
            autoComplete='new-password'
          />
        </div>

        <div className='flex w-full items-center justify-end gap-3'>
          <Button
            size='sm'
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            size='sm'
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
