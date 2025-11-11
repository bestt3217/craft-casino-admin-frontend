import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export const getCasinoReports = async (params: {
  startDate: number | string
  endDate: number | string
  page?: number
  limit?: number
}): Promise<any> => {
  try {
    const response = await api.get<any>('/reports/casino', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get casino reports')
  }
}
