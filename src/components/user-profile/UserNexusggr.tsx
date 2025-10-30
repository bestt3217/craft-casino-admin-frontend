'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getSettings } from '@/api/game-providers'
import { updateUserNexusggrRtp } from '@/api/users'

import { NexusggrRtpSchema, nexusggrRtpSchema } from '@/lib/nexusggr'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'

import { IUserWithProfile } from '@/types/users'

export default function UserNexusggr({
  user,
  fetchUser,
}: {
  user: IUserWithProfile
  fetchUser: () => void
}) {
  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<NexusggrRtpSchema>({
    resolver: zodResolver(nexusggrRtpSchema),
    defaultValues: {
      rtp: user.nexusggrRtp || 0,
    },
  })

  const rtp = watch('rtp')

  const handleUpdate = async (data: NexusggrRtpSchema) => {
    try {
      const response = await updateUserNexusggrRtp({
        id: user._id,
        rtp: data.rtp,
      })
      fetchUser()
      reset({
        rtp: response.rtp,
      })
      toast.success(`RTP updated to ${response.rtp} successfully`)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to update Nexusggr RTP')
      }
    }
  }

  const fetchNexusggrSettings = useCallback(async () => {
    try {
      if (!rtp) {
        const response = await getSettings()
        reset({
          rtp: response?.rtp,
        })
      }
    } catch (error) {
      console.error(error)
      // toast.error('Failed to fetch Nexusggr Settings')
    }
  }, [reset, rtp])

  useEffect(() => {
    fetchNexusggrSettings()
  }, [fetchNexusggrSettings])

  return (
    <div className='rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
      <div>
        <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
          Game RTP
        </h4>

        <div className='grid grid-cols-1 gap-4'>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <div>
                <Label>Target RTP</Label>
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
            </div>

            <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
              <Button
                disabled={!isDirty || isSubmitting}
                size='sm'
                type='submit'
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
