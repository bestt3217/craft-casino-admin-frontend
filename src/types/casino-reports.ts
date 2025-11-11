export interface CasinoReportUser {
  userAvatar: string
  totalBetAmount: number
  totalWinAmount: number
  betCount: number
  winCount: number
  firstTxnAt: string
  lastTxnAt: string
  totalGGR: number
  avgBet: number
  userId: string
  username: string
  email: string
  country: string
}

export interface CasinoReportsMeta {
  page: number
  limit: number
  totalUsers: number
  totalPages: number
  sortBy: string
  sortDir: string
  dateRange: {
    startDate: string
    endDate: string
  }
}

export interface CasinoReportsTotals {
  totalBetAmount: number
  totalWinAmount: number
  totalGGR: number
}

export interface CasinoReportsResponse {
  ok: boolean
  meta: CasinoReportsMeta
  totals: CasinoReportsTotals
  data: CasinoReportUser[]
}
