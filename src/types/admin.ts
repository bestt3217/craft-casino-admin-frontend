import { IRole } from '@/types/role'

interface ActionLog {
  // Define properties based on your actual action log structure
  action: string
  timestamp: Date
  details?: object
}

export interface IAdmin {
  _id: string
  roles: string[]
  password: string
  username: string
  email: string
  isOTPEnabled: boolean
  otpData: string
  isTwoFAEnabled: boolean
  twoFASecret: string
  notes: string
  lastAdminLogin: Date | null
  isActive: boolean
  permissions: string[]
  actionLogs: ActionLog[]
  grantedAt: Date
  createdAt: Date
  updatedAt: Date
  googleId: string | null
  gmail: string | null
  googleUsername: string | null
  avatar: string | null
  __v: number
}

export interface IAdminDataCollection {
  _id: string
  roles: IRole[]
  password: string
  username: string
  email: string
  isOTPEnabled: boolean
  otpData: string
  isTwoFAEnabled: boolean
  twoFASecret: string
  notes: string
  lastAdminLogin: Date | null
  isActive: boolean
  permissions: string[]
  actionLogs: ActionLog[]
  grantedAt: Date
  createdAt: Date
  updatedAt: Date
  avatar: string | null
  __v: number
}

export interface IAdminsListResponse {
  rows: IAdminDataCollection[]
  totalPages: number
  currentPage: number
  error?: any
}
