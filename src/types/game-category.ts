import { ICasino } from '@/types/casino'

export interface ICategory {
  _id: string
  title: string
  gameIds: string[]
  isPinned: boolean
  displayOrder: number
  icon: string
  createdAt: Date
  updatedAt: Date
}

export type GameCategoryListRequest = {
  page: number
  limit: number
  filter?: string
}

export type GameCategoryListResponse = {
  total: number
  page: number
  limit: number
  data: ICategory[]
}

export type GameCategoryResponse = {
  data: ICategory
  games: ICasino[]
}

export type GameCategoryFormRequest = {
  title?: string
  gameIds?: string[]
  isPinned?: boolean
  displayOrder?: number
  icon?: string
}

export type GameCategoryFormResponse = {
  status: 'success' | 'error'
  message: string
}
