'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import CreateBonusForm from './CreateBonusForm'

const CreateBonusPage = () => {
  const router = useRouter()

  const handleSuccess = (bonusId: string) => {
    router.push(`/bonus/${bonusId}`)
  }

  return (
    <div className='mx-auto max-w-4xl'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Create New Bonus
        </h1>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Create a new bonus offer for your users. Choose between welcome
          bonuses and first-time deposit bonuses.
        </p>
      </div>

      <CreateBonusForm onSuccess={handleSuccess} />
    </div>
  )
}

export default CreateBonusPage
