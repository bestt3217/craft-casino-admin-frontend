'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

import TextArea from './input/TextArea'
import Label from './Label'

interface FormTextareaProps {
  name: string
  label?: string
  placeholder?: string
  description?: string
  rows?: number
  disabled?: boolean
  className?: string
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  label,
  placeholder,
  description,
  rows = 3,
  disabled = false,
  className = '',
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()

  const error = errors[name]
  const errorMessage = error?.message as string
  const currentValue = watch(name) || ''

  const handleChange = () => {
    // This will be handled by react-hook-form
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {description && (
            <span className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
              ({description})
            </span>
          )}
        </Label>
      )}

      <TextArea
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        error={!!error}
        hint={errorMessage}
        className='w-full'
      />
    </div>
  )
}

export default FormTextarea
