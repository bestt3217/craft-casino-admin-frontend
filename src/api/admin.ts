import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IAdmin,
  IAdminDataCollection,
  IAdminsListResponse,
} from '@/types/admin'

export const getAdmins = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<IAdminsListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<IAdminsListResponse>('/admins', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get admins')
  }
}

export const getAdminById = async (
  id: string
): Promise<IAdminDataCollection> => {
  try {
    const response = await api.get<IAdminDataCollection>(`/admins/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get admin')
  }
}

export const createAdmin = async (adminData: IAdmin): Promise<IAdmin> => {
  try {
    const response = await api.post<IAdmin>('/admins', adminData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create admin')
  }
}

export const updateAdmin = async (
  id: string,
  adminData: Partial<IAdmin>
): Promise<IAdmin> => {
  try {
    const response = await api.put<IAdmin>(`/admins/${id}`, adminData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create admin')
  }
}

export const deleteAdmin = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/admins/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete admin')
  }
}

export const uploadAvatar = async (formData: FormData) => {
  try {
    const response = await api.post('/admins/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload admin avatar')
  }
}
