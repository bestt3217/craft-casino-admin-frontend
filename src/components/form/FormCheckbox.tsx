'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

import Checkbox from './input/Checkbox'
import Label from './Label'

interface FormCheckboxProps {
  name: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  description,
  disabled = false,
  className = '',
}) => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  const error = errors[name]
  const errorMessage = error?.message as string
  const currentValue = watch(name) || false

  const handleChange = (checked: boolean) => {
    setValue(name, checked)
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className='mb-2'>
          <Label htmlFor={name}>
            {label}
            {description && (
              <span className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
                ({description})
              </span>
            )}
          </Label>
        </div>
      )}

      <Checkbox
        id={name}
        checked={currentValue}
        onChange={handleChange}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />

      {error && (
        <p className='text-xs text-red-500 dark:text-red-400'>{errorMessage}</p>
      )}
    </div>
  )
}

export default FormCheckbox
