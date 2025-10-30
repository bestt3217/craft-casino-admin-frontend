'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

import Input from './input/InputField'
import Label from './Label'

interface FormFieldProps {
  name: string
  label?: string
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time'
  placeholder?: string
  description?: string
  min?: string | number
  max?: string | number
  step?: number
  disabled?: boolean
  className?: string
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  description,
  min,
  max,
  step,
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

      <Input
        {...register(name)}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={currentValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        error={!!error}
        errorMessage={errorMessage}
        className='w-full'
      />
    </div>
  )
}

export default FormField
