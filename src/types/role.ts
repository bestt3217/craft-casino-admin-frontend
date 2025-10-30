export interface IPermission {
  _id: string
  key: string
  name: string
}
export interface IRole {
  _id: string
  name: string
  permissions: IPermission[] | string[]
  createdAt: Date
  updatedAt: Date
}

export interface IRoleCollection {
  _id: string
  name: string
  permissions: IPermission[]
  createdAt: Date
  updatedAt: Date
}

export interface IRolesListResponse {
  rows: IRoleCollection[]
  totalPages: number
  currentPage: number
  error?: any
}
