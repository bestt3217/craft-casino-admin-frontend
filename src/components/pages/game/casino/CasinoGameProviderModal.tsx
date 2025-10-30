import React, { useEffect, useMemo, useState } from 'react'

import { updateProviderStatus } from '@/api/game'

import { handleApiError } from '@/lib/error'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { ICasinoGameProvider } from '@/types/game'

const STATUS_OPTIONS = [
  {
    value: '1',
    label: 'Active',
  },
  {
    value: '0',
    label: 'Inactive',
  },
]

const CasinoGameProviderModal = ({
  selectedItem,
  isOpen,
  onClose,
  onSuccess,
}: {
  selectedItem: ICasinoGameProvider
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) => {
  const [origin, setOrigin] = useState<string>(
    selectedItem?.origin ? selectedItem.origin[0] : ''
  )
  const [status, setStatus] = useState<string>(
    selectedItem?.status ? selectedItem.status[0].toString() : ''
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const index = selectedItem.origin.findIndex((o) => o === origin)
      const id = selectedItem.providerIds[index]
      await updateProviderStatus({
        id,
        status: parseInt(status),
      })
      onSuccess()
    } catch (error) {
      handleApiError(error, 'Error submitting game provider')
    } finally {
      setIsLoading(false)
    }
  }

  const disabled = useMemo(() => {
    if (isLoading || !selectedItem) return true

    const index = selectedItem
      ? selectedItem.origin.findIndex((o) => o === origin)
      : null

    if (index < 0) return true

    return selectedItem.status[index] === parseInt(status)
  }, [isLoading, origin, status, selectedItem])

  useEffect(() => {
    setOrigin(selectedItem?.origin[0])
    setStatus(selectedItem?.status[0].toString())
  }, [selectedItem])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-[600px] p-5 lg:p-10'
    >
      <h4 className='text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90'>
        {selectedItem?.name}
      </h4>

      <div className='space-y-4'>
        <div>
          <Label>Origin</Label>
          <Select
            className='w-full'
            placeholder='Origin'
            options={selectedItem?.origin?.map((origin) => ({
              value: origin,
              label: origin,
            }))}
            defaultValue={origin}
            onChange={setOrigin}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select
            className='w-full'
            placeholder='Status'
            options={STATUS_OPTIONS}
            defaultValue={status}
            onChange={setStatus}
          />
        </div>
      </div>
      <div className='mt-8 flex w-full items-center justify-end gap-3'>
        <Button size='sm' variant='outline' onClick={onClose}>
          Close
        </Button>
        <Button size='sm' onClick={handleSubmit} disabled={disabled}>
          {isLoading ? (
            <LoadingSpinner className='mx-auto size-5' />
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </Modal>
  )
}

export default CasinoGameProviderModal
