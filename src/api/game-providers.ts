import api from '@/lib/api'
import { handleApiError } from '@/lib/error'
import { NexusggrSettingSchema } from '@/lib/nexusggr'

import {
  GameProvider,
  GameProviderListResponse,
  IGameProviderImageResponse,
} from '@/types/game-provider'

export const getGameProviders = async ({
  page,
  limit,
  type,
  filter,
}: {
  page: number
  limit: number
  type: string
  filter?: string
}): Promise<GameProviderListResponse> => {
  try {
    const response = await api.get<GameProviderListResponse>(
      `/game-provider/${type}`,
      {
        params: {
          page,
          limit,
          filter,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get providers')
  }
}

export const getGameProviderByCode = async (
  type: string,
  code: string
): Promise<GameProvider> => {
  try {
    const response = await api.get<GameProvider>(
      `/game-provider/${type}/${code}`
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get providers')
  }
}

/**
 * Toggle status of a game provider
 * @returns The created game provider data
 */
export const toggleGameProvider = async (
  type: string,
  id: string
): Promise<any> => {
  try {
    const res = await api.post<any>(`/game-provider/toggle/${type}/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update game provider')
  }
}

export const getBalanceOfAgent = async (type: string) => {
  try {
    const response = await api.get<{ balance: number }>(
      `/game-provider/${type}/balance`
    )
    return response.data.balance
  } catch (error) {
    handleApiError(error, 'Failed to get providers')
  }
}

export const getSettings = async () => {
  try {
    const response = await api.get<NexusggrSettingSchema>(
      `/game-provider/nexusggr-settings`
    )

    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get settings')
  }
}

export const updateSettings = async (
  type: string,
  data: NexusggrSettingSchema
) => {
  try {
    const response = await api.put<NexusggrSettingSchema>(
      `/game-provider/nexusggr-settings`,
      data
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update settings')
  }
}

export const updateGameProvider = async (
  id: string,
  { banner }: GameProvider
) => {
  try {
    const response = await api.post<IGameProviderImageResponse>(
      `/game-provider/update/${id}`,
      {
        banner,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update Game Provider')
  }
}

export const uploadProviderImage = async (formData: FormData) => {
  try {
    const response = await api.post<IGameProviderImageResponse>(
      `/game-provider/update-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload Game Provider image')
  }
}
