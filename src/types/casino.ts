export interface ICasino {
  _id: string
  id: number | string
  game_name: string
  game_code: string
  provider_code: string
  banner: string
  image: string
  type: string
  status: string | number
  home_page: boolean
  order: number
  is_pinned: boolean
}

export interface IGameProvider {
  _id: string
  name: string
  code: string
  type: string
  status: string | number
}
export interface ICasinoListResponse {
  rows: ICasino[]
  totalPages: number
  currentPage: number
  error?: any
}

export const CasinoType = {
  SLOT: 'slot',
  LIVE: 'live',
}
