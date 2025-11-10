'use client'

import { FileIcon } from 'lucide-react'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { addUserBalance, banUser, getUsers, muteUser } from '@/api/users'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import Loading from '@/components/common/Loading'
import UsersTable from '@/components/tables/UsersTable'
import Button from '@/components/ui/button/Button'

import { IUserData } from '@/types/users'

export default function UserListPage() {
  const [tableData, setTableData] = useState<IUserData[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const fetchUsers = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getUsers({
          page,
          limit,
          filter: filter || '',
        })
        if (response.success) {
          setTableData(response.rows)
          setTotalPages(response.pagination.totalPages)
          setPage(response.pagination.currentPage)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  const handleBanStatusChange = async (userId: string, status: boolean) => {
    try {
      const response = await banUser({ id: userId, ban: status })
      if (response.success) {
        fetchUsers()
        if (status) {
          toast.success('User banned successfully')
        } else {
          toast.success('User unbanned successfully')
        }
      }
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleMuteStatusChange = async (userId: string, status: boolean) => {
    try {
      const response = await muteUser({ id: userId, mute: status })
      if (response.success) {
        fetchUsers()
        if (status) {
          toast.success('User muted successfully')
        } else {
          toast.success('User unmuted successfully')
        }
      }
    } catch (error) {
      console.error('Error muting user:', error)
    }
  }

  const handleBalanceChange = async (userId: string, balance: string) => {
    try {
      const response = await addUserBalance({
        id: userId,
        balance: parseFloat(balance),
      })
      if (response.success) {
        fetchUsers()
        toast.success('User balance updated successfully')
      }
    } catch (error) {
      console.error('Error updating user balance:', error)
    }
  }

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      // Fetch all users with limit -1 to get all data
      const response = await getUsers({
        page: 1,
        limit: -1,
        filter: '',
      })

      if (response.success && response.rows) {
        // Convert data to CSV format
        const headers = [
          'Username',
          'Full Name',
          'Email',
          'Role',
          'Rank',
          'Level',
          'Balance',
          'Email Verified',
          'Banned Status',
          'Last Login IP',
          'Last Login Location',
          'Last Login Time',
          'Member Since',
        ]

        const csvRows = [
          headers.join(','),
          ...response.rows.map((row) => {
            return [
              `"${row.username || ''}"`,
              `"${row.fullName || ''}"`,
              `"${row.email || ''}"`,
              `"${row.role || ''}"`,
              row.currentTier || '',
              row.currentLevel || '',
              Number(row.balance).toFixed(2),
              row.isEmailVerified ? 'Yes' : 'No',
              row.isBanned ? 'Banned' : 'Allowed',
              `"${row.lastLoginIp || 'N/A'}"`,
              `"${row.lastLoginCountry || 'N/A'}"`,
              row.lastLoginTime
                ? moment(row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')
                : 'N/A',
              moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            ].join(',')
          }),
        ]

        const csvContent = csvRows.join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute(
          'download',
          `users_export_${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`
        )
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('Users exported to CSV successfully')
      } else {
        toast.error('Failed to export users')
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('An error occurred while exporting users')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <ComponentCard
      title='Users'
      inputSearchElement={<InputSearch fetchData={fetchUsers} />}
      action={
        <Button
          size='xs'
          variant='primary'
          onClick={handleExportCSV}
          disabled={isExporting}
        >
          {isExporting ? <Loading /> : <FileIcon />} Export CSV
        </Button>
      }
    >
      <UsersTable
        tableData={tableData}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        onBanStatusChange={handleBanStatusChange}
        onMuteStatusChange={handleMuteStatusChange}
        onBalanceChange={handleBalanceChange}
      />
    </ComponentCard>
  )
}
