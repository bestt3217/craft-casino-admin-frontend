import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { NexusggrSettingSchema, nexusggrSettingSchema } from '@/lib/nexusggr'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

const NexusggrSettingsModal = ({
  isOpen,
  onClose,
  onSubmit,
  settings,
}: {
  isOpen: boolean
  onSubmit: (data: NexusggrSettingSchema) => Promise<boolean>
  onClose: () => void
  settings: NexusggrSettingSchema | null
}) => {
  const handleOnClose = () => {
    onClose()
  }
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<NexusggrSettingSchema>({
    resolver: zodResolver(nexusggrSettingSchema),
    defaultValues: {
      rtp: settings?.rtp || 0,
      ggr: settings?.ggr || 0,
    },
  })

  const handleOnSubmit = async (data: NexusggrSettingSchema) => {
    const isSuccess = await onSubmit(data)
    if (isSuccess) {
      handleOnClose()
    }
  }

  useEffect(() => {
    reset({
      rtp: settings?.rtp || 0,
      ggr: settings?.ggr || 0,
    })
  }, [settings, reset])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      className='m-4 max-w-[700px]'
    >
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            Providers Settings
          </h4>
        </div>

        <form
          className='mt-7 flex flex-col gap-4 px-2 pb-3'
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <div>
            <Label>RTP</Label>
            <Controller
              name='rtp'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  type='number'
                  error={Boolean(errors.rtp?.message)}
                  errorMessage={errors.rtp?.message || ''}
                />
              )}
            />
          </div>
          <div>
            <Label>GGR</Label>
            <Controller
              name='ggr'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  type='number'
                  error={Boolean(errors.ggr?.message)}
                  errorMessage={errors.ggr?.message || ''}
                />
              )}
            />
          </div>

          <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
            <Button
              size='sm'
              variant='outline'
              type='button'
              onClick={handleOnClose}
            >
              Close
            </Button>
            <Button disabled={!isDirty || isSubmitting} size='sm' type='submit'>
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default NexusggrSettingsModal
