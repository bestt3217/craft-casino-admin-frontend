const TRANSACTION_TYPES = {
  BET: 'BET',
  WIN: 'WIN',
  LOSE: 'LOSE',
  REFUND: 'REFUND',
}

const GAME_TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  LOSE: 'LOSE',
}

enum GAME_CATEGORIES {
  SLOTS = 'Slots',
  LIVE_CASINO = 'Live Casino',
  CRASH = 'Crash',
}

type ICasinoGameProvider = {
  providerIds: string[]
  name: string
  code: string[]
  type: string[]
  origin: string[]
  status: number[]
}

// Define game interface based on casino games structure
export interface ICasinoGame {
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

export type { ICasinoGameProvider }
export { GAME_CATEGORIES, GAME_TRANSACTION_STATUS, TRANSACTION_TYPES }
