'use client'

import { XIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
  title?: string
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  alt,
  title,
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className='bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black'
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className='relative max-h-[90vh] max-w-[90vw] rounded-lg bg-white dark:bg-gray-800'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            {title || 'Image Preview'}
          </h3>
          <button
            onClick={onClose}
            className='rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Image Container */}
        <div className='relative p-4'>
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={600}
            className='max-h-[70vh] max-w-full rounded-lg object-contain'
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder-image.png'
            }}
            unoptimized
          />
        </div>

        {/* Footer */}
        <div className='border-t border-gray-200 px-4 py-3 dark:border-gray-700'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Click outside the image or press ESC to close
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageModal
