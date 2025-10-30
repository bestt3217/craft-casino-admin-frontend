'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

import { uploadBonusBanner } from '@/api/bonus'

import Button from '@/components/ui/button/Button'

interface ImageUploadProps {
  name: string
  label: string
  description?: string
  accept?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  label,
  description,
  accept = 'image/*',
}) => {
  const { setValue, watch } = useFormContext()
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentValue = watch(name)

  // Initialize preview if there's an existing image URL
  useEffect(() => {
    if (currentValue && typeof currentValue === 'string') {
      setPreview(currentValue)
      setUploadedUrl(currentValue)
    }
  }, [currentValue])

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Create preview URL for immediate feedback
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload to server
      const formData = new FormData()
      formData.append('file', file)

      const response = await uploadBonusBanner(formData)

      if (response?.url) {
        // Store the cloud URL in the form
        setUploadedUrl(response.url)
        setValue(name, response.url)
        toast.success('Image uploaded successfully')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error(error.message || 'Failed to upload image')
      // Reset preview on error
      setPreview(null)
      setValue(name, null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setUploadedUrl(null)
    setValue(name, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
        {label}
      </label>

      {description && (
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          {description}
        </p>
      )}

      <div className='flex items-center space-x-4'>
        {/* Preview */}
        {preview && (
          <div className='relative'>
            <Image
              src={preview}
              alt='Preview'
              width={0}
              height={0}
              sizes='100vw'
              className='h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-gray-700'
            />
            <button
              type='button'
              onClick={handleRemove}
              className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white hover:bg-red-600'
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className='flex flex-col space-y-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClick}
            disabled={isUploading}
            size='sm'
          >
            {isUploading
              ? 'Uploading...'
              : preview
                ? 'Change Image'
                : 'Upload Image'}
          </Button>

          {uploadedUrl && (
            <p className='text-xs text-green-600 dark:text-green-400'>
              ✓ Image uploaded
            </p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        onChange={handleFileSelect}
        className='hidden'
      />
    </div>
  )
}

export default ImageUpload
