import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  GameCategoryFormRequest,
  GameCategoryFormResponse,
  GameCategoryListRequest,
  GameCategoryListResponse,
  GameCategoryResponse,
} from '@/types/game-category'

export const getGameCategories = async (
  params: GameCategoryListRequest
): Promise<GameCategoryListResponse> => {
  try {
    const response = await api.get('/game-categories', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get game categories')
  }
}

export const getGameCategory = async (
  id: string
): Promise<GameCategoryResponse> => {
  try {
    const response = await api.get(`/game-categories/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get game category')
  }
}

export const createGameCategory = async (
  payload: GameCategoryFormRequest
): Promise<GameCategoryFormResponse> => {
  try {
    const response = await api.post('/game-categories', payload)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create game category')
  }
}

export const updateGameCategory = async (
  id: string,
  payload: GameCategoryFormRequest
): Promise<GameCategoryFormResponse> => {
  try {
    const response = await api.put(`/game-categories/${id}`, payload)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update game category')
  }
}

export const deleteGameCategory = async (
  id: string
): Promise<GameCategoryFormResponse> => {
  try {
    const response = await api.delete(`/game-categories/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete game category')
  }
}

export const uploadIcon = async (formData: FormData) => {
  try {
    const response = await api.post('/game-categories/upload-icon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload game category icon')
  }
}
