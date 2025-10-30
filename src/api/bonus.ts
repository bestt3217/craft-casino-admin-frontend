import api from '@/lib/api' // Assuming you have an api instance setup
import { handleApiError } from '@/lib/error'

import {
  Bonus,
  BonusDetailResponse,
  BonusListResponse,
  BonusSuccessResponse,
  IBonusEligibility,
  IBonusSettings,
  IBonusTierRewards,
} from '@/types/bonus'

interface UpdateBonusResponse {
  success: boolean
  bonus: Bonus
  eligibility: IBonusEligibility
  settings: IBonusSettings
  tierRewards: IBonusTierRewards[]
}

interface CreateBonusResponse {
  success: boolean
  bonus: Bonus
}

/**
 * Create a new bonus
 * @param bonusData The bonus data to create
 * @returns The created bonus data
 */
export const createBonus = async (
  bonusData: any
): Promise<CreateBonusResponse> => {
  try {
    const res = await api.post<CreateBonusResponse>('/bonus', bonusData)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create bonus')
  }
}

export const updateBonus = async (
  id: string,
  bonusData: any
): Promise<UpdateBonusResponse> => {
  try {
    const res = await api.put<UpdateBonusResponse>(`/bonus/${id}`, bonusData)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update bonus')
  }
}

export const getBonuses = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: any
}): Promise<BonusListResponse> => {
  try {
    const res = await api.get<BonusListResponse>('/bonus', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get bonuses')
  }
}

export const getBonusDetail = async (
  id: string
): Promise<BonusDetailResponse> => {
  try {
    const res = await api.get<BonusDetailResponse>(`/bonus/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get bonus')
  }
}

export const deleteBonus = async (
  id: string
): Promise<BonusSuccessResponse> => {
  try {
    const res = await api.delete<BonusSuccessResponse>(`/bonus/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete bonus')
  }
}

interface BonusBannerUploadResponse {
  url: string
}

/**
 * Upload bonus banner image
 * @param formData FormData containing the image file
 * @returns The uploaded image URL
 */
export const uploadBonusBanner = async (
  formData: FormData
): Promise<BonusBannerUploadResponse> => {
  try {
    const res = await api.post<BonusBannerUploadResponse>(
      '/bonus/upload-banner',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to upload bonus banner')
  }
}
