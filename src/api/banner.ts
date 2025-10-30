import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IBannerData,
  IBannerDetailResponse,
  IBannerImageResponse,
  IBannerListResponse,
  IBannerUpdateResponse,
} from '@/types/banner'

export const getBanners = async ({
  page,
  limit,
  filter,
  section,
}: {
  page: number
  limit: number
  filter?: string
  section?: string
}): Promise<IBannerListResponse> => {
  try {
    const response = await api.get<IBannerListResponse>('/banner/list', {
      params: {
        page,
        limit,
        filter,
        section,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get banners')
  }
}

export const createBanner = async ({
  title,
  image,
  position,
  language,
  device,
  section,
}: IBannerData) => {
  try {
    const response = await api.post<IBannerUpdateResponse>('/banner/create', {
      title,
      image,
      position,
      language,
      device,
      section,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create banner')
  }
}

export const updateBanner = async (
  id: string,
  { title, image, position, language, device, section }: IBannerData
) => {
  try {
    const response = await api.post<IBannerUpdateResponse>(
      `/banner/update/${id}`,
      {
        title,
        image,
        position,
        language,
        device,
        section,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update banner')
  }
}

export const getBannerDetail = async (id: string) => {
  try {
    const response = await api.get<IBannerDetailResponse>(`/banner/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update banner')
  }
}

export const deleteBanner = async (id: string, levelId?: string) => {
  try {
    const response = await api.delete<IBannerUpdateResponse>(
      `/banner/delete/${id}`,
      {
        params: {
          levelId,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete banner')
  }
}

export const uploadBannerImage = async (formData: FormData) => {
  try {
    const response = await api.post<IBannerImageResponse>(
      `/banner/update-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload banner image')
  }
}
