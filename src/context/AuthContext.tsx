'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

import { exchangeToken, getCurrentUser } from '@/api/auth'

import {
  clearTokenExpirationTimeout,
  setTokenExpirationTimeout,
} from '@/lib/api'
import storageHandler from '@/lib/storage-utils'
import subscription, { SUBSCRIPTION_EVENTS } from '@/lib/v2/subscription'

import SessionExpiredModal from '@/components/common/SessionExpiredModal'

import { IAdmin } from '@/types/admin'
import { IRole } from '@/types/role'

export type ILoginUser = Omit<IAdmin, 'roles'> & { roles: IRole[] }

interface AuthContextType {
  isLoading: boolean
  user: ILoginUser
  setUser: React.Dispatch<React.SetStateAction<ILoginUser | null>>
  logout: () => Promise<void>
  getLoggedInUser: () => Promise<void>
  checkAuth: (identifier?: string) => Promise<void>
  isAuthenticated: boolean
  allowedRoutes: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const {
  getValue: getToken,
  setValue: setToken,
  removeValue: removeToken,
} = storageHandler({ key: 'token' })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ILoginUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const searchparams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [identifier, setIdentifier] = useState<string>('')
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false)
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>([])

  const handleLogout = useCallback(() => {
    clearTokenExpirationTimeout()
    removeToken()
    setIsExpiredModalOpen(false)
    window.location.href = '/signin'
  }, [])

  const checkAuth = useCallback(
    async (identifier?: string) => {
      try {
        if (!identifier) throw new Error('Identifier is not received')

        const { token: exchangedToken } = await exchangeToken(identifier)
        setToken(exchangedToken)
        const storedToken = getToken()
        if (!storedToken) {
          toast.error('Login failed...')
          return
        }
        const { admin: user, allowedRoutes } = await getCurrentUser()
        setUser(user)
        setAllowedRoutes(allowedRoutes)
        setIsAuthenticated(true)
        setIdentifier('')
        toast.success('Login successfully!')
      } catch (error) {
        handleLogout()
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Failed to get user')
        }
      }
    },
    [handleLogout]
  )

  const getLoggedInUser = useCallback(async () => {
    try {
      const storedToken = getToken()
      if (!storedToken) {
        setIsLoading(false)
        return
      }
      const response = await getCurrentUser()
      if (response.success) {
        setUser(response.admin)
        setAllowedRoutes(response.allowedRoutes)
        setIsAuthenticated(true)
      } else {
        toast.error('Login failed. Please login again.')
        handleLogout()
      }
    } catch (error) {
      handleLogout()
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to get user')
      }
    }
    setIsLoading(false)
  }, [handleLogout])

  const logout = useCallback(async () => {
    try {
      handleLogout()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to logout')
      }
    }
  }, [handleLogout])

  useEffect(() => {
    const identifier_param = searchparams.get('identifier')
    const warning_param = searchparams.get('warning')

    if (identifier_param) {
      setIdentifier(identifier_param)
    }

    if (warning_param) {
      toast.error(warning_param)
    }

    // if (typeof window !== 'undefined') {
    //   router.replace(window.location.pathname)
    // }
  }, [searchparams, router])

  useEffect(() => {
    if (identifier) {
      checkAuth(identifier)
    }
  }, [identifier, checkAuth])

  useEffect(() => {
    getLoggedInUser()
  }, [getLoggedInUser])

  useEffect(() => {
    if (!isAuthenticated) {
      setIsExpiredModalOpen(false)
      return
    }

    const handleTokenExpired = () => {
      if (isAuthenticated) {
        setIsExpiredModalOpen(true)
      }
    }

    subscription.subscribe(
      SUBSCRIPTION_EVENTS.AUTH_TOKEN_EXPIRED,
      handleTokenExpired
    )

    return () => {
      subscription.unsubscribe(
        SUBSCRIPTION_EVENTS.AUTH_TOKEN_EXPIRED,
        handleTokenExpired
      )
    }
  }, [isAuthenticated])

  // Set token expiration timeout when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Set the token expiration timeout when user is authenticated
      setTokenExpirationTimeout()
    }
  }, [isAuthenticated, user])

  const value = useMemo(
    () => ({
      isLoading,
      user,
      setUser,
      logout,
      checkAuth,
      getLoggedInUser,
      isAuthenticated,
      allowedRoutes,
    }),
    [
      isLoading,
      user,
      setUser,
      logout,
      checkAuth,
      getLoggedInUser,
      isAuthenticated,
      allowedRoutes,
    ]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiredModal
        isOpen={isExpiredModalOpen}
        backToSignIn={() => {
          setIsExpiredModalOpen(false)
          logout()
        }}
      />
    </AuthContext.Provider>
  )
}

// Custom hook for using the user context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider')
  }
  return context
}
