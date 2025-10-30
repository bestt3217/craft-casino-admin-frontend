'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useAuth } from '@/context/AuthContext'

import Spinner from '@/components/common/Spinner'

interface IPermissionContext {
  allowedRoutes: string[]
}
const PermissionContext = createContext<IPermissionContext | undefined>(
  undefined
)

const signinRoute = '/signin'
const publicRoutes = [
  signinRoute,
  '/verify',
  '/reset-password',
  '/error-404',
  '/blocked',
  '/permission-denied',
]

export function PermissionProvider({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading: isAuthLoading, user, allowedRoutes } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const isRouteAllowed = useCallback(
    (path: string) => {
      if (!allowedRoutes.length) return false
      if (publicRoutes.includes(path)) return true
      return allowedRoutes.some(
        (allowedPath) => allowedPath.split('/')[1] === path.split('/')[1]
      )
    },
    [allowedRoutes]
  )

  useEffect(() => {
    if (isAuthLoading) return

    if (!user && !publicRoutes.includes(pathname)) {
      setIsRedirecting(true)
      router.replace(signinRoute)
      setIsRedirecting(false)
      return
    }

    if (user) {
      if (
        user.roles.some((role: any) => role.name === 'Affiliate') &&
        pathname === '/'
      ) {
        setIsRedirecting(true)
        router.push('/partner')
        setIsRedirecting(false)
        return
      }
    }

    if (user && !isRouteAllowed(pathname)) {
      setIsRedirecting(true)
      router.replace('/permission-denied')
      setIsRedirecting(false)
      return
    }

    if (user && pathname === signinRoute) {
      if (allowedRoutes.length > 0) {
        setIsRedirecting(true)
        router.replace(allowedRoutes[0])
        setIsRedirecting(false)
        return
      }
    }

    setIsRedirecting(false)
  }, [isAuthLoading, user, pathname, router, allowedRoutes, isRouteAllowed])

  if (
    isAuthLoading ||
    isRedirecting ||
    (!publicRoutes.includes(pathname) && !isRouteAllowed(pathname))
  )
    return <Spinner />

  return (
    <PermissionContext.Provider value={{ allowedRoutes }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermission() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }
  return context
}
