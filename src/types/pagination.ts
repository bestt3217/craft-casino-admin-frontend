declare global {
  interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export {}
