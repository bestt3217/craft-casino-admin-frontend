'use client'
import { Key, List, UserCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'

import { useSidebar } from '../context/SidebarContext'
import {
  BannerIcon,
  ChevronDownIcon,
  DollarLineIcon,
  GamePadIcon,
  GiftIcon,
  GridIcon,
  HandHeartIcon,
  HorizontaLDots,
  PromotionIcon,
  SettingsIcon,
  UserRoundCog,
} from '../icons/index'

import { NavItem } from '@/types/sidebar'

const getNavItems = (t: (key: string) => string): NavItem[] => [
  {
    icon: <GridIcon />,
    name: t('navigation.dashboard'),
    path: '/',
  },
  {
    icon: <List />,
    name: t('navigation.reports'),
    subItems: [
      {
        name: t('navigation.casino'),
        path: `/reports/casino`,
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    name: t('navigation.platformSettings'),
    subItems: [
      {
        name: t('navigation.siteSettings'),
        path: `/settings`,
      },
      {
        name: t('navigation.ip'),
        path: `/ip`,
      },
      {
        name: t('navigation.cms'),
        path: `/cms`,
      },
    ],
  },
  {
    name: t('navigation.transactions'),
    icon: <DollarLineIcon />,
    subItems: [
      {
        name: t('navigation.deposit'),
        path: '/transactions/deposit',
        pro: false,
      },
      {
        name: t('navigation.withdraw'),
        path: '/transactions/withdraw',
        pro: false,
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: t('navigation.adminManagement'),
    subItems: [
      {
        name: t('navigation.admins'),
        path: '/admins',
      },
    ],
  },
  {
    icon: <UserRoundCog />,
    name: t('navigation.userManagement'),
    subItems: [
      {
        name: t('navigation.users'),
        path: `/users`,
      },
      {
        name: t('navigation.botUsers'),
        path: `/bot-users`,
      },
    ],
  },
  {
    icon: <HandHeartIcon />,
    name: t('navigation.loyaltyTiers'),
    path: `/tier`,
  },
  {
    icon: <PromotionIcon stroke='#E4E7EC' />,
    name: t('navigation.promotions'),
    path: `/promotion`,
  },
  {
    icon: <BannerIcon stroke='#E4E7EC' />,
    name: t('navigation.banners'),
    path: `/banner`,
  },
  {
    icon: <GiftIcon />,
    name: t('navigation.bonusReward'),
    subItems: [
      {
        name: t('navigation.bonuses'),
        path: `/bonus`,
      },
    ],
  },
  {
    name: t('navigation.games'),
    icon: <GamePadIcon />,
    subItems: [
      {
        name: t('navigation.freeSpins'),
        path: '/game/free-spins',
        pro: false,
      },
      {
        name: t('navigation.providers'),
        path: '/game/casino/providers',
        pro: false,
      },
      {
        name: t('navigation.gameCategories'),
        path: '/games/categories',
        pro: false,
      },
    ],
  },
  {
    icon: <Key stroke='#E4E7EC' />,
    name: t('navigation.apiKey'),
    path: `/apikey`,
  },
]

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
  const pathname = usePathname()
  const { allowedRoutes } = useAuth()
  const { t } = useI18n()
  
  const navItems = useMemo(() => getNavItems(t), [t])

  // Check if a route is allowed based on allowedRoutes
  const isRouteAllowed = useCallback(
    (nav: NavItem) => {
      if (!allowedRoutes || allowedRoutes.length === 0) return false

      if (nav.subItems) {
        return nav.subItems.some((subItem) =>
          allowedRoutes.some(
            (allowedPath) =>
              allowedPath.split('/')[1] === subItem.path.split('/')[1]
          )
        )
      }

      return allowedRoutes.some(
        (allowedPath) => allowedPath.split('/')[1] === nav.path.split('/')[1]
      )
    },
    [allowedRoutes]
  )

  const filteredNavItems = useMemo(
    () => navItems.filter((nav) => isRouteAllowed(nav)),
    [isRouteAllowed, navItems]
  )

  const renderMenuItems = () => (
    <ul className='flex flex-col gap-4'>
      {allowedRoutes.length > 0 &&
        filteredNavItems.map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, 'main')}
                className={`menu-item group ${
                  openSubmenu?.type === 'main' && openSubmenu?.index === index
                    ? 'menu-item-active'
                    : 'menu-item-inactive'
                } cursor-pointer ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}`}
              >
                <span
                  className={`${
                    openSubmenu?.type === 'main' && openSubmenu?.index === index
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className='menu-item-text'>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                      openSubmenu?.type === 'main' &&
                      openSubmenu?.index === index
                        ? 'text-brand-500 rotate-180'
                        : ''
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className='menu-item-text'>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${'main'}-${index}`] = el
                }}
                className='overflow-hidden transition-all duration-300'
                style={{
                  height:
                    openSubmenu?.type === 'main' && openSubmenu?.index === index
                      ? `${subMenuHeight[`${'main'}-${index}`]}px`
                      : '0px',
                }}
              >
                <ul className='mt-2 ml-9 space-y-1'>
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? 'menu-dropdown-item-active'
                            : 'menu-dropdown-item-inactive'
                        }`}
                      >
                        {subItem.name}
                        <span className='ml-auto flex items-center gap-1'>
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? 'menu-dropdown-badge-active'
                                  : 'menu-dropdown-badge-inactive'
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? 'menu-dropdown-badge-active'
                                  : 'menu-dropdown-badge-inactive'
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
    </ul>
  )

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others'
    index: number
  } | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback(
    (path: string) =>
      path === pathname ||
      (path !== '/' &&
        path !== '/trivia' &&
        pathname.split('/').length > 2 &&
        pathname.includes(path + '/')),
    [pathname]
  )

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }))
      }
    }
  }, [openSubmenu])

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null
      }
      return { type: menuType, index }
    })
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-[100dvh] flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen
          ? 'w-[290px]'
          : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        } ${isMobileOpen ? 'py-4' : 'py-8'}`}
      >
        {!isMobileOpen && (
          <Link href='/'>
            {isExpanded || isHovered ? (
              <>
                <Image
                  className='dark:hidden'
                  src='/images/logo/logo.png'
                  alt='Logo'
                  width={160}
                  height={50}
                />
                <Image
                  className='hidden dark:block'
                  src='/images/logo/logo.png'
                  alt='Logo'
                  width={160}
                  height={50}
                />
              </>
            ) : (
              <Image
                src='/images/logo/logo-symbol.png'
                alt='Logo'
                width={62}
                height={62}
              />
            )}
          </Link>
        )}
      </div>
      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        <nav className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots />
                )}
              </h2>

              {renderMenuItems()}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar
