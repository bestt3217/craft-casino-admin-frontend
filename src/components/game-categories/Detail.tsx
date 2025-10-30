'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  createGameCategory,
  deleteGameCategory,
  getGameCategory,
  updateGameCategory,
  uploadIcon,
} from '@/api/game-category'

import ComponentCard from '@/components/common/ComponentCard'
import ConfirmModal from '@/components/common/ConfirmModal'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import GamesSortList from '@/components/game-categories/GamesSortList'
import GamesTable from '@/components/game-categories/GamesTable'
import Button from '@/components/ui/button/Button'

import { CheckCircleIcon, ChevronLeftIcon, TrashBinIcon } from '@/icons'

import { ICasino } from '@/types/casino'
import { ICategory } from '@/types/game-category'

const GameCategoriesDetail = ({ id }: { id: string }) => {
  const router = useRouter()
  const isCreate = id === 'create'
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [selectedGameIds, setSelectedGameIds] = useState<Set<string>>(
    new Set([])
  )
  const [selectedGames, setSelectedGames] = useState<ICasino[]>([])
  const [iconUrl, setIconUrl] = useState<string | null>(null)
  const iconFileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ICategory>()
  const isPinned = watch('isPinned')

  const handleSelectIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      setIconUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async () => {
    try {
      const file = iconFileRef.current?.files?.[0]

      if (!file) {
        return {
          status: true,
          icon: undefined,
        }
      }
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadIcon(formData)

      iconFileRef.current.value = null

      return {
        status: true,
        icon: result.url,
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
      return {
        status: false,
        icon: null,
      }
    }
  }

  const onSubmit: SubmitHandler<ICategory> = async (formData) => {
    if (selectedGameIds.size < 1) {
      toast.error('Please select at least one game.')
      return
    }

    if (isLoading) return
    setIsLoading(true)

    const { status, icon } = await uploadImage()
    if (!status) return

    const payload = {
      ...formData,
      gameIds: Array.from(selectedGameIds),
      icon,
    }

    try {
      const result = isCreate
        ? await createGameCategory(payload)
        : await updateGameCategory(id, payload)
      if (result.status === 'success') {
        toast.success('Category saved successfully.')

        router.push('/games/categories')
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const result = await deleteGameCategory(id)
      if (result.status === 'success') {
        toast.success('Category deleted successfully.')
        router.push('/games/categories')
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveGame = (id: string) => {
    const newSelectedGameIds = new Set(selectedGameIds)
    newSelectedGameIds.delete(id)
    setSelectedGameIds(newSelectedGameIds)
    setSelectedGames((prev) => prev.filter((game) => game._id !== id))
  }

  useEffect(() => {
    if (isCreate) return

    const fetchData = async () => {
      const response = await getGameCategory(id)
      setSelectedGameIds(new Set(response.data.gameIds))
      setValue('title', response.data.title)
      setValue('displayOrder', response.data.displayOrder)
      setValue('isPinned', response.data.isPinned)
      setIconUrl(response.data.icon)
      setSelectedGames(response.games)
    }

    fetchData()
  }, [isCreate, id, setValue])

  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='w-full max-w-md px-5 sm:pt-5'>
        <Link
          href='/games/categories'
          className='flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        >
          <ChevronLeftIcon />
          Back to list
        </Link>
      </div>

      <div className='p-5'>
        <ComponentCard title='Information'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-6 sm:grid-cols-4'
          >
            <div>
              <Label>Title</Label>
              <span className='text-error-500 text-xs'>
                {errors?.title?.message || ''}
              </span>
              <input
                className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                {...register('title', {
                  required: 'Title required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                })}
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className='flex h-11 w-fit items-center justify-center gap-2'>
                <button
                  type='button'
                  onClick={() => iconFileRef.current?.click()}
                >
                  <Image
                    src={iconUrl || '/images/preview.png'}
                    alt='Category icon'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-6 w-6 rounded-lg object-contain'
                  />
                </button>
                <input
                  type='file'
                  onChange={handleSelectIcon}
                  ref={iconFileRef}
                  className='hidden'
                />
              </div>
            </div>
            <div>
              <Label>Order</Label>
              <input
                type='number'
                className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                {...register('displayOrder')}
              />
            </div>
            <div>
              <Switch
                label='Pinned'
                labelClassName='flex-col-reverse items-start'
                defaultChecked={isPinned}
                onChange={(checked) => setValue('isPinned', checked)}
              />
            </div>
            <div className='sm:col-span-3'>
              <GamesTable
                selectedGameIds={selectedGameIds}
                onSelectedChange={setSelectedGameIds}
                selectedGames={selectedGames}
                setSelectedGames={setSelectedGames}
              />
            </div>
            <div>
              <GamesSortList
                selected={selectedGameIds}
                gamesData={selectedGames}
                onOrderChange={setSelectedGameIds}
                onRemove={handleRemoveGame}
              />
            </div>
            <div className='flex gap-2 sm:col-span-4'>
              <Button
                type='submit'
                startIcon={<CheckCircleIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Submit'}
              </Button>
              {!isCreate && (
                <Button
                  className='bg-error-500 hover:bg-error-600'
                  startIcon={<TrashBinIcon />}
                  disabled={isLoading}
                  onClick={() => setOpenConfirm(true)}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>
          </form>
          <ConfirmModal
            open={openConfirm}
            title='Are you Sure?'
            description='You can not restore deleted record.'
            handleConfirm={handleDelete}
            handleClose={handleClose}
          />
        </ComponentCard>
      </div>
    </div>
  )
}

export default GameCategoriesDetail
