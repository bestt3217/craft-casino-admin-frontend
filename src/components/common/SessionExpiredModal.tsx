'use client'

import React from 'react'

import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import ExpireSessionIcon from '@/icons/session-expired.svg'

const SessionExpiredModal = ({
  isOpen,
  backToSignIn,
}: {
  isOpen: boolean
  backToSignIn: () => void
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing by clicking outside or pressing escape
      showCloseButton={false}
      className='m-4 max-w-[500px]'
      position='center'
    >
      <div className='flex flex-col items-center justify-center gap-5 p-6'>
        <ExpireSessionIcon className='w-40' />
        <div className='flex flex-col items-center justify-center gap-2 text-center'>
          <h3 className='text-2xl font-bold text-white'>
            Your session has expired due to inactivity
          </h3>
          <p className='text-sm text-gray-400'>
            You have been inactive for a while. Please login again to continue.
          </p>
        </div>
        <Button
          variant='outline'
          className='min-w-[150px] !py-3'
          onClick={backToSignIn}
        >
          Back to sign in
        </Button>
      </div>
    </Modal>
  )
}

export default SessionExpiredModal
