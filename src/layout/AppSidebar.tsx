'use client'
import { Key, List, UserCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@/context/AuthContext'

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

export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Dashboard',
    path: '/',
    // subItems: [
    //   {
    //     name: 'Overview',
    //     path: '/',
    //   },
    //   {
    //     name: 'Finance',
    //     path: '/finance',
    //   },
    // ],
  },
  // {
  //   icon: <MegaphoneIcon />,
  //   name: 'Marketing',
  //   subItems: [
  //     {
  //       name: 'Analytics',
  //       path: '/marketing',
  //     },
  //     {
  //       name: 'UTM Links',
  //       path: `/utm-links`,
  //     },
  //   ],
  // },
  {
    icon: <List />,
    name: 'Reports',
    subItems: [
      {
        name: 'Casino',
        path: `/reports/casino`,
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    name: 'Platform Settings',
    subItems: [
      {
        name: 'Site Settings',
        path: `/settings`,
      },
      {
        name: 'IP',
        path: `/ip`,
      },
      {
        name: 'CMS',
        path: `/cms`,
      },
      // {
      //   name: 'Email Template',
      //   path: `/email-template`,
      // },
      // {
      //   name: 'Operating Providers',
      //   path: `/operating-providers`,
      // },
      // {
      //   name: 'Crypto Assets',
      //   path: `/crypto/assets`,
      // },
      // {
      //   name: 'Crypto Wallet',
      //   path: `/crypto/wallet`,
      // },
    ],
  },
  {
    name: 'Transactions',
    icon: <DollarLineIcon />,
    subItems: [
      {
        name: 'Deposit',
        path: '/transactions/deposit',
        pro: false,
      },
      {
        name: 'Withdraw',
        path: '/transactions/withdraw',
        pro: false,
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: 'Admin Management',
    subItems: [
      {
        name: 'Admins',
        path: '/admins',
      },
      // {
      //   name: 'Roles',
      //   path: `/roles`,
      // },
    ],
  },
  {
    icon: <UserRoundCog />,
    name: 'User Management',
    subItems: [
      {
        name: 'Users',
        path: `/users`,
      },
      {
        name: 'Bot Users',
        path: `/bot-users`,
      },
    ],
  },
  {
    icon: <HandHeartIcon />,
    name: 'Loyalty Tiers (VIP)',
    path: `/tier`,
  },
  // {
  //   icon: <UsersRound />,
  //   name: 'Affiliate',
  //   subItems: [
  //     {
  //       name: 'User Affiliate',
  //       path: `/user-affiliate`,
  //     },
  //     {
  //       name: 'Tier Affiliate',
  //       path: `/tier-affiliate`,
  //     },
  //     {
  //       name: 'UTM Links',
  //       path: `/utm-links`,
  //     },
  //   ],
  // },
  {
    icon: <PromotionIcon stroke='#E4E7EC' />,
    name: 'Promotions',
    path: `/promotion`,
  },
  {
    icon: <BannerIcon stroke='#E4E7EC' />,
    name: 'Banners',
    path: `/banner`,
  },
  {
    icon: <GiftIcon />,
    name: 'Bonus & Reward',
    subItems: [
      {
        name: 'Bonuses',
        path: `/bonus`,
      },
    ],
  },
  {
    name: 'Games',
    icon: <GamePadIcon />,
    subItems: [
      {
        name: 'Free Spins',
        path: '/game/free-spins',
        pro: false,
      },
      {
        name: 'Providers',
        path: '/game/casino/providers',
        pro: false,
      },
      {
        name: 'Game Categories',
        path: '/games/categories',
        pro: false,
      },
    ],
  },
  {
    icon: <Key stroke='#E4E7EC' />,
    name: 'API Key',
    path: `/apikey`,
  },
]

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
  const pathname = usePathname()
  const { allowedRoutes } = useAuth()

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
    [isRouteAllowed]
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
