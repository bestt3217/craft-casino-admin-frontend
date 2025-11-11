'use client'

import { useEffect, useState } from 'react'
import { DateRange, DayPicker, Matcher } from 'react-day-picker'

import 'react-day-picker/style.css'

import Button from '@/components/ui/button/Button'
import Popover from '@/components/ui/popover/Popover'

import { CalenderIcon } from '@/icons'

interface DateRangeSelectorProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  disabledDays?: Matcher | Matcher[]
  placeholder?: string
  className?: string
}

const DateRangeSelector = ({
  value,
  onChange,
  disabledDays,
  placeholder = 'Select Date Range',
  className,
}: DateRangeSelectorProps) => {
  const [tempRange, setTempRange] = useState<DateRange | undefined>(value)

  useEffect(() => {
    setTempRange(value)
  }, [value])

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getDisplayText = (): string => {
    if (!value?.from && !value?.to) {
      return placeholder
    }
    if (value.from && !value.to) {
      return `${formatDate(value.from)} - ...`
    }
    if (value.from && value.to) {
      return `${formatDate(value.from)} - ${formatDate(value.to)}`
    }
    return placeholder
  }

  const handleSelect = (closePopover: () => void) => {
    if (tempRange?.from && tempRange?.to) {
      onChange?.(tempRange)
      closePopover()
    }
  }

  return (
    <div className={className}>
      <Popover
        position='bottom'
        width='350px'
        trigger={
          <Button
            variant='outline'
            startIcon={<CalenderIcon />}
            className='min-w-[280px] justify-start'
          >
            {getDisplayText()}
          </Button>
        }
      >
        {(closePopover) => (
          <div className='p-4'>
            <DayPicker
              mode='range'
              selected={tempRange || value}
              disabled={disabledDays}
              onSelect={setTempRange}
              className='mb-4 text-white'
            />
            <div className='flex items-center justify-between gap-2 border-t border-gray-200 pt-4 dark:border-white/[0.03]'>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {tempRange?.from && tempRange?.to
                  ? `${formatDate(tempRange.from)} - ${formatDate(tempRange.to)}`
                  : tempRange?.from
                    ? `${formatDate(tempRange.from)} - ...`
                    : 'Select a date range'}
              </div>
              <Button
                size='sm'
                onClick={() => handleSelect(closePopover)}
                disabled={!tempRange?.from || !tempRange?.to}
              >
                Select
              </Button>
            </div>
          </div>
        )}
      </Popover>
    </div>
  )
}

export default DateRangeSelector
