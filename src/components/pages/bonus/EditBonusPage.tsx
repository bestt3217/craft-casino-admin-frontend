'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import EditBonusForm from './EditBonusForm'

interface EditBonusPageProps {
  bonusId: string
}

const EditBonusPage: React.FC<EditBonusPageProps> = ({ bonusId }) => {
  const router = useRouter()

  const handleSuccess = (bonusId: string) => {
    router.push(`/bonus/${bonusId}`)
  }

  return (
    <div className='mx-auto max-w-4xl'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Edit Bonus
        </h1>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Update the bonus configuration and settings.
        </p>
      </div>

      <EditBonusForm bonusId={bonusId} onSuccess={handleSuccess} />
    </div>
  )
}

export default EditBonusPage
