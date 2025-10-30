'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getBalanceOfAgent,
  getGameProviders,
  getSettings,
  updateSettings,
} from '@/api/game-providers'

import { NexusggrSettingSchema } from '@/lib/nexusggr'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import MetricsCard from '@/components/metrics/MetricsCard'
import NexusggrSettingsModal from '@/components/nexusggr/NexusggrSettingsModal'
import GameProvidersTable from '@/components/pages/game-providers/GameProvidersTable'

import { GameProvider } from '@/types/game-provider'

const ProviderManagementPage = () => {
  // const { type } = useParams<{ type: string }>()
  const type = 'nexusggr'
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [gameProviders, setGameProviders] = useState<GameProvider[]>([])
  const [balanceOfAgent, setBalanceOfAgent] = useState<number>(0)
  const [settings, setSettings] = useState<NexusggrSettingSchema | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false)
  const fetchGameProviders = useCallback(async () => {
    try {
      const response = await getGameProviders({
        page,
        limit,
        type,
        filter: '',
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setGameProviders(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching providers')
      }
    }
  }, [page, limit, type])

  const fetchBalanceOfAgent = useCallback(async () => {
    try {
      const res = await getBalanceOfAgent(type)
      setBalanceOfAgent(res)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching balance')
      }
    }
  }, [type])

  const fetchSettings = useCallback(async () => {
    try {
      const res = await getSettings()
      setSettings(res)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching settings')
      }
    }
  }, [])

  const handleUpdateSettings = useCallback(
    async (data: NexusggrSettingSchema) => {
      try {
        const res = await updateSettings(type, data)
        setSettings(res)
        return true
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error updating settings')
        }
        return false
      }
    },
    [type]
  )

  const initialLoading = useCallback(async () => {
    await Promise.all([
      fetchGameProviders(),
      fetchBalanceOfAgent(),
      fetchSettings(),
    ])
    setIsLoading(false)
  }, [fetchGameProviders, fetchSettings, fetchBalanceOfAgent])

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <MetricsCard title='Total Providers' value={gameProviders.length} />
        <MetricsCard
          title='Total Games'
          value={`${gameProviders.reduce(
            (acc, provider) => acc + (provider.countGames || 0),
            0
          )}`}
        />
        <MetricsCard
          title='Balance of Agent'
          tooltipText='Balance of Games Agent.'
          value={`${balanceOfAgent < 0 ? '-' : ''}$${Math.abs(balanceOfAgent || 0).toFixed(2)}`}
        />
        <MetricsCard
          hasEdit
          title='RTP'
          tooltipText='All games RTP'
          value={`${settings?.rtp || 0}%`}
          onEdit={() => setIsSettingsModalOpen(true)}
        />
        <MetricsCard
          hasEdit
          title='GGR'
          tooltipText='Games GGR'
          onEdit={() => setIsSettingsModalOpen(true)}
          value={`${settings?.ggr || 0}%`}
        />
      </div>

      <ComponentCard title='Providers'>
        <GameProvidersTable
          type={type}
          gameProviders={gameProviders}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchGameProviders={fetchGameProviders}
        />
      </ComponentCard>

      <NexusggrSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSubmit={handleUpdateSettings}
        settings={settings}
      />
    </div>
  )
}

export default ProviderManagementPage
