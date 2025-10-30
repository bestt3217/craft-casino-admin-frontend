import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export const getAvailablePlayers = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<any> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<any>('/game/free-spin/players', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get available players')
  }
}

export const getFreeSpinsGames = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<any> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<any>('/game/free-spin/games', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get free spins games')
  }
}

export const getFreeSpins = async ({
  validTo,
}: {
  validTo: string
}): Promise<any> => {
  try {
    const params = new URLSearchParams({
      validTo,
    })
    const response = await api.get<any>('/game/free-spin', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get free spins')
  }
}

export const removeFreeSpins = async (payload: {
  playerIds?: string[]
  freeSpinId: string
}): Promise<any> => {
  try {
    const response = await api.delete<any>('/game/free-spin', {
      data: payload,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to remove free spins')
  }
}

export const addFreeSpins = async (payload: {
  title: string
  gameIds: string[]
  playerIds: string[]
  available: number
  validTo: string
  validFrom?: string
  betLevel?: string
}): Promise<any> => {
  try {
    const response = await api.post<any>('/game/free-spin', payload)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get free spins games')
  }
}
