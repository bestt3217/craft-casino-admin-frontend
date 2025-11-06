'use client'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React from 'react'

import { formatNumber } from '@/lib/utils'

import Loading from '@/components/common/Loading'
import BalanceEditModal from '@/components/tables/BalanceEditModal'
import Pagination from '@/components/tables/Pagination'
import PasswordChangeModal from '@/components/tables/PasswordChangeModal'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import { Dropdown } from '@/components/ui/dropdown/Dropdown'
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { MoreDotIcon } from '@/icons'

import { IUserData } from '@/types/users'

type UsersTableProps = {
  tableData: IUserData[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  onBanStatusChange?: (userId: string, status: boolean) => void
  onMuteStatusChange?: (userId: string, status: boolean) => void
  onBalanceChange?: (userId: string, balance: string) => void
}

export default function UsersTable({
  tableData,
  totalPages,
  page,
  setPage,
  isLoading,
  onBanStatusChange,
  // onMuteStatusChange,
  onBalanceChange,
}: UsersTableProps) {
  const router = useRouter()
  const goToDetail = (id: string) => {
    router.push(`/profile/${id}`)
  }
  const [openStatusDropdown, setOpenStatusDropdown] = React.useState<
    string | null
  >(null)
  const [openBalanceDropdown, setOpenBalanceDropdown] = React.useState<
    string | null
  >(null)
  const [balanceModalOpen, setBalanceModalOpen] = React.useState<string | null>(
    null
  )
  const [openFullNameDropdown, setOpenFullNameDropdown] = React.useState<
    string | null
  >(null)
  const [changePasswordModalOpen, setChangePasswordModalOpen] = React.useState<
    string | null
  >(null)

  // const [openMuteDropdown, setOpenMuteDropdown] = React.useState<string | null>(
  //   null
  // )

  const toggleStatusDropdown = (userId: string) => {
    setOpenStatusDropdown(openStatusDropdown === userId ? null : userId)
  }

  const toggleBalanceDropdown = (userId: string) => {
    setOpenBalanceDropdown(openBalanceDropdown === userId ? null : userId)
  }

  const toggleFullNameDropdown = (userId: string) => {
    setOpenFullNameDropdown(openFullNameDropdown === userId ? null : userId)
  }

  const handleOpenBalanceModal = (userId: string) => {
    setBalanceModalOpen(userId)
    setOpenBalanceDropdown(null)
  }

  const handleCloseBalanceModal = () => {
    setBalanceModalOpen(null)
  }

  const handleSaveBalance = async (userId: string, balance: number) => {
    if (onBalanceChange) {
      await onBalanceChange(userId, balance.toString())
    }
  }

  // const toggleMuteDropdown = (userId: string) => {
  //   setOpenMuteDropdown(openMuteDropdown === userId ? null : userId)
  // }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
            <div className='min-w-[1102px]'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                  <TableRow>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      User
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Full Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Rank
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Level
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Balance
                    </TableCell>
                    {/* <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Mute Status
                    </TableCell> */}
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Email Verified
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Banned Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Last Login IP
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Last Login Location
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Last Login At
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Member Since
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {tableData &&
                    tableData.length > 0 &&
                    tableData.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell className='px-5 py-4 text-start sm:px-6'>
                          <div className='flex items-center gap-3'>
                            <UserAvatar
                              src={row.avatar}
                              alt={row.username}
                              size='large'
                              status='online'
                              onClick={() => goToDetail(row._id)}
                              className='cursor-pointer'
                            />
                            <div>
                              <span
                                className='text-theme-sm block cursor-pointer font-medium text-gray-800 dark:text-white/90'
                                onClick={() => goToDetail(row._id)}
                              >
                                {row.username}
                              </span>
                              <span className='text-theme-xs block text-gray-500 dark:text-gray-400'>
                                {row.role}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-pointer px-4 py-3 text-center whitespace-nowrap text-gray-500 dark:text-gray-400'>
                          <div className='relative'>
                            <button
                              type='button'
                              onClick={() => toggleFullNameDropdown(row._id)}
                              className='dropdown-toggle flex items-center gap-2'
                            >
                              <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
                              {row.fullName || '-'}
                            </button>
                            <Dropdown
                              isOpen={openFullNameDropdown === row._id}
                              onClose={() => setOpenFullNameDropdown(null)}
                              className='w-fit p-2'
                            >
                              <DropdownItem
                                onItemClick={() => {
                                  setChangePasswordModalOpen(row._id)
                                  setOpenFullNameDropdown(null)
                                }}
                                className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                              >
                                Change password
                              </DropdownItem>
                            </Dropdown>
                          </div>
                        </TableCell>
                        <TableCell
                          className='text-theme-sm cursor-pointer px-4 py-3 text-center text-gray-500 dark:text-gray-400'
                          onClick={() => goToDetail(row._id)}
                        >
                          {row.email ? row.email : '-'}
                        </TableCell>
                        <TableCell
                          className='text-theme-sm cursor-pointer px-4 py-3 text-center text-gray-500 dark:text-gray-400'
                          onClick={() => goToDetail(row._id)}
                        >
                          {row.currentTier || '-'}
                        </TableCell>
                        <TableCell
                          className='text-theme-sm cursor-pointer px-4 py-3 text-center text-gray-500 dark:text-gray-400'
                          onClick={() => goToDetail(row._id)}
                        >
                          {row.currentLevel || '-'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center justify-center'>
                            <div className='relative inline-block'>
                              <button
                                type='button'
                                onClick={() => toggleBalanceDropdown(row._id)}
                                className='dropdown-toggle flex items-center gap-2'
                              >
                                <span className='text-theme-xs text-gray-500 dark:text-gray-400'>
                                  {formatNumber(
                                    Number(Number(row.balance).toFixed(2))
                                  )}
                                </span>
                                <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
                              </button>
                              <Dropdown
                                isOpen={openBalanceDropdown === row._id}
                                onClose={() => setOpenBalanceDropdown(null)}
                                className='w-fit p-2'
                              >
                                <DropdownItem
                                  onItemClick={() => {
                                    handleOpenBalanceModal(row._id)
                                  }}
                                  className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                                >
                                  Edit Balance
                                </DropdownItem>
                              </Dropdown>
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center justify-center'>
                            <div className='relative inline-block'>
                              <Badge
                                size='sm'
                                color={row.isMuted ? 'error' : 'success'}
                              >
                                {row.isMuted ? 'Muted' : 'Allowed'}
                              </Badge>

                              <button
                                onClick={() => toggleMuteDropdown(row._id)}
                                className='dropdown-toggle flex items-center'
                              >
                                <Badge
                                  size='sm'
                                  color={row.isMuted ? 'error' : 'success'}
                                >
                                  {row.isMuted ? 'Muted' : 'Allowed'}
                                </Badge>
                                <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
                              </button>
                              <Dropdown
                                isOpen={openMuteDropdown === row._id}
                                onClose={() => setOpenMuteDropdown(null)}
                                className='w-fit p-2'
                              >
                                <DropdownItem
                                  onItemClick={() =>
                                    onMuteStatusChange?.(row._id, true)
                                  }
                                  className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                                >
                                  Mute User
                                </DropdownItem>
                                <DropdownItem
                                  onItemClick={() =>
                                    onMuteStatusChange?.(row._id, false)
                                  }
                                  className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                                >
                                  Unmute User
                                </DropdownItem>
                              </Dropdown>
                            </div>
                          </div>
                        </TableCell> */}
                        <TableCell
                          className='text-theme-sm cursor-pointer px-4 py-3 text-center text-gray-500 dark:text-gray-400'
                          onClick={() => goToDetail(row._id)}
                        >
                          <Badge
                            size='sm'
                            color={row.isEmailVerified ? 'success' : 'error'}
                          >
                            <span className='whitespace-nowrap'>
                              {row.isEmailVerified
                                ? 'Verified'
                                : 'Not Verified'}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-pointer px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center justify-center'>
                            <div className='relative inline-block'>
                              <button
                                type='button'
                                onClick={() => toggleStatusDropdown(row._id)}
                                className='dropdown-toggle flex items-center'
                              >
                                <Badge
                                  size='sm'
                                  color={row.isBanned ? 'error' : 'success'}
                                >
                                  {row.isBanned ? 'Banned' : 'Allowed'}
                                </Badge>
                                <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
                              </button>
                              <Dropdown
                                isOpen={openStatusDropdown === row._id}
                                onClose={() => setOpenStatusDropdown(null)}
                                className='w-fit p-2'
                              >
                                <DropdownItem
                                  onItemClick={() => {
                                    onBanStatusChange?.(row._id, true)
                                    setOpenStatusDropdown(null)
                                  }}
                                  className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                                >
                                  Ban User
                                </DropdownItem>
                                <DropdownItem
                                  onItemClick={() => {
                                    onBanStatusChange?.(row._id, false)
                                    setOpenStatusDropdown(null)
                                  }}
                                  className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                                >
                                  Allow User
                                </DropdownItem>
                              </Dropdown>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center whitespace-nowrap text-gray-500 dark:text-gray-400'>
                          {row.lastLoginIp || 'N/A'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center whitespace-nowrap text-gray-500 dark:text-gray-400'>
                          {row.lastLoginCountry || 'N/A'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center whitespace-nowrap text-gray-500 dark:text-gray-400'>
                          {row.lastLoginTime
                            ? moment(row.lastLoginTime).format('YYYY-MM-DD')
                            : 'N/A'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center whitespace-nowrap text-gray-500 dark:text-gray-400'>
                          {moment(row.createdAt).format('YYYY-MM-DD')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
                className='mb-5 justify-center'
              />
            )}
          </div>
        </div>
      )}
      {balanceModalOpen &&
        tableData.find((row) => row._id === balanceModalOpen) && (
          <BalanceEditModal
            isOpen={true}
            onClose={handleCloseBalanceModal}
            currentBalance={Number(
              tableData.find((row) => row._id === balanceModalOpen)?.balance ||
                0
            )}
            username={
              tableData.find((row) => row._id === balanceModalOpen)?.username ||
              ''
            }
            onSave={async (balance: number) => {
              if (balanceModalOpen) {
                await handleSaveBalance(balanceModalOpen, balance)
              }
            }}
          />
        )}
      {changePasswordModalOpen &&
        tableData.find((row) => row._id === changePasswordModalOpen) && (
          <PasswordChangeModal
            isOpen={true}
            onClose={() => setChangePasswordModalOpen(null)}
            userId={changePasswordModalOpen}
            username={
              tableData.find((row) => row._id === changePasswordModalOpen)
                ?.username || ''
            }
          />
        )}
    </>
  )
}
