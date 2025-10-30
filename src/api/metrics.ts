import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { GetFtdTransactionsResponse } from '@/types/ftd'
import {
  IAnalytics,
  IConversionRates,
  IMainGGRStats,
  IMetrics,
} from '@/types/metrics'

export const getMetrics = async (): Promise<IMetrics> => {
  try {
    const response = await api.get('/metrics/metrics')
    return response.data.rows
  } catch (error) {
    handleApiError(error, 'Failed to get metrics')
  }
}

export const getMainGGRStats = async (payload: {
  startDate: string
  endDate: string
}): Promise<IMainGGRStats> => {
  try {
    const response = await api.get('/metrics/ggr', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get ggr')
  }
}

export const getAnalytics = async (): Promise<IAnalytics[]> => {
  try {
    const response = await api.get('/metrics/analytics')
    return response.data.rows
  } catch (error) {
    handleApiError(error, 'Failed to get analytics')
  }
}

export const getConversionRates = async (): Promise<IConversionRates> => {
  try {
    const response = await api.get('/metrics/conversion-rates')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get conversion rates')
  }
}

interface IFtdSummaryPayload {
  startDate: string
  endDate: string
}

export const getFtdSummary = async (
  payload: IFtdSummaryPayload
): Promise<any> => {
  try {
    const response = await api.get('/metrics/ftd-metrics', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get ftd summary')
  }
}

interface IFtdBreakDownPayload {
  page: number
  limit: number
  startDate: string
  endDate: string
}

export const getFtdTransactions = async ({
  page,
  limit,
  startDate,
  endDate,
}: IFtdBreakDownPayload): Promise<GetFtdTransactionsResponse> => {
  try {
    const response = await api.get('/metrics/ftd-transactions', {
      params: { page, limit, startDate, endDate },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get ftd transactions')
  }
}
