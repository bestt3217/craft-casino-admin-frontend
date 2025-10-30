import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { Pagination, PaginationParams } from '@/types/common'
import {
  CryptoTransaction,
  GameTransaction,
  ServiceTransaction,
} from '@/types/transaction'

interface TransactionsParams extends PaginationParams {
  filters?: {
    type?: string
    search?: string
  }
}

export interface TransactionsResponse {
  rows: GameTransaction[] | CryptoTransaction[] | ServiceTransaction[]
  pagination: Pagination
}
export const getTransactions = async ({
  page,
  limit,
  filters,
}: TransactionsParams): Promise<TransactionsResponse> => {
  const response = await api.get(`/transactions`, {
    params: { page, limit, filters },
  })

  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response.data
}

export const getSeedData = async (params: { type: string }) => {
  const response = await api.get(`/transactions/seed`, { params })

  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response.data
}

export const approveWithdrawal = async (transactionId: string) => {
  try {
    const response = await api.post(`/transactions/approve-withdrawal`, {
      transactionId,
    })

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to approve withdrawal')
  }
}

export const rejectWithdrawal = async (transactionId: string) => {
  try {
    const response = await api.post(`/transactions/reject-withdrawal`, {
      transactionId,
    })

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to approve withdrawal')
  }
}
