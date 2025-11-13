'use client'

import React from 'react'

import { useI18n } from '@/context/I18nContext'

import Select from '@/components/form/Select'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useI18n()

  const languageOptions = [
    {
      label: t('language.english'),
      value: 'en',
    },
    {
      label: t('language.turkish'),
      value: 'tr',
    },
  ]

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'tr')
  }

  return (
    <Select
      options={languageOptions}
      placeholder={t('language.selectLanguage')}
      onChange={handleLanguageChange}
      value={language}
      className='min-w-[150px]'
    />
  )
}

export default LanguageSelector

