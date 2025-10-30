import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { ICasino, ICasinoListResponse } from '@/types/casino'

export const getGamesList = async (params: {
  page: number
  limit: number
  type?: string
  filter: string
  code?: string
}): Promise<ICasinoListResponse> => {
  try {
    const response = await api.get<ICasinoListResponse>('/casino/list', {
      params,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get games list')
  }
}

export const updateGameDetail = async (
  game_code: string,
  params: { property: string; value: string | number | boolean }
): Promise<ICasino> => {
  try {
    const response = await api.post<ICasino>(`/casino/update/${game_code}`, {
      params,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update game detail')
  }
}

export const getGameDetail = async (game_code: string): Promise<ICasino> => {
  try {
    const response = await api.get<ICasino>(`/casino/detail/${game_code}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get game detail')
  }
}

export const updateCasinoImage = async (
  game_code: string,
  image: string
): Promise<ICasino> => {
  try {
    const response = await api.post<ICasino>(
      `/casino/update/image/${game_code}`,
      { image }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update casino image')
  }
}
