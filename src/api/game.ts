import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export const getCasinoGameProviders = async ({
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
    const response = await api.get<any>('/game/casino/providers', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get casino game providers')
  }
}

export const updateProviderStatus = async (payload: {
  id: string
  status: number
}): Promise<any> => {
  try {
    const response = await api.post<any>(
      '/game/casino/provider/status',
      payload
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update provider status')
  }
}

interface GetCasinoGamesListParams {
  page: number
  limit: number
  type: 'freespin'
  search?: string
}
export const getCasinoGamesList = async ({
  page,
  limit,
  type,
  search,
}: GetCasinoGamesListParams): Promise<any> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      type,
      search: search || '',
    })

    const response = await api.get<any>('/game/casino/list', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get casino game providers')
  }
}
