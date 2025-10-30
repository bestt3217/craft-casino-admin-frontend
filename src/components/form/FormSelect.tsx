'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

import Label from './Label'
import Select from './Select'

interface Option {
  label: string
  value: string
}

interface FormSelectProps {
  name: string
  label?: string
  options: Option[]
  placeholder?: string
  description?: string
  disabled?: boolean
  className?: string
  onChange?: (value: string) => void
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder = 'Select an option',
  description,
  disabled = false,
  className = '',
  onChange,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  const error = errors[name]
  const errorMessage = error?.message as string
  const currentValue = watch(name)

  const handleChange = (value: string) => {
    setValue(name, value)
    if (onChange) {
      onChange(value)
    }
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

      <Select
        {...register(name)}
        options={options}
        placeholder={placeholder}
        onChange={handleChange}
        defaultValue={currentValue}
        disabled={disabled}
        error={!!error}
        errorMessage={errorMessage}
        className='w-full'
      />
    </div>
  )
}

export default FormSelect
