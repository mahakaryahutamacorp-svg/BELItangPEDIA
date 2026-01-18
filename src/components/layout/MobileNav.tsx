'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, ShoppingCart, User, LayoutGrid } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function MobileNav() {
  const pathname = usePathname()
  const cartItemCount = useCartStore((state) => state.getTotalItems())
  const { isAuthenticated } = useAuthStore()

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Beranda',
      isActive: pathname === '/'
    },
    {
      href: '/search',
      icon: Search,
      label: 'Cari',
      isActive: pathname === '/search'
    },
    {
      href: '/cart',
      icon: ShoppingCart,
      label: 'Keranjang',
      isActive: pathname === '/cart',
      isCart: true
    },
    {
      href: '/categories',
      icon: LayoutGrid,
      label: 'Toko',
      isActive: pathname === '/categories'
    },
    {
      href: isAuthenticated ? '/profile' : '/auth/login',
      icon: User,
      label: 'Akun',
      isActive: pathname.startsWith('/profile') || pathname.startsWith('/auth')
    }
  ]

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon

        if (item.isCart) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-cart"
            >
              <Icon size={24} />
              {cartItemCount > 0 && (
                <span className="mobile-nav-badge">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${item.isActive ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        )
      })}

      <style jsx>{`
                .mobile-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 70px;
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border-light);
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 0 var(--space-2);
                    z-index: var(--z-fixed);
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
                }

                @media (min-width: 768px) {
                    .mobile-nav {
                        display: none;
                    }
                }

                .mobile-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    padding: var(--space-2) var(--space-3);
                    color: var(--text-tertiary);
                    transition: all var(--transition-fast);
                    position: relative;
                    border-radius: var(--radius-xl);
                }

                .mobile-nav-item:hover {
                    color: var(--primary-600);
                }

                .mobile-nav-item.active {
                    color: var(--primary-600);
                }

                .mobile-nav-item.active::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 3px;
                    background: var(--primary-500);
                    border-radius: 0 0 var(--radius-full) var(--radius-full);
                }

                .mobile-nav-item span {
                    font-size: 10px;
                    font-weight: 600;
                }

                .mobile-nav-cart {
                    position: relative;
                    width: 56px;
                    height: 56px;
                    background: var(--bg-gradient);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    margin-top: -24px;
                    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
                    transition: all var(--transition-fast);
                }

                .mobile-nav-cart:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
                }

                .mobile-nav-cart:active {
                    transform: scale(0.95);
                }

                .mobile-nav-badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    min-width: 20px;
                    height: 20px;
                    background: var(--accent-red);
                    color: white;
                    font-size: 11px;
                    font-weight: 700;
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                    border: 2px solid var(--bg-primary);
                    animation: bounce 0.5s ease;
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                }

                /* Safe area for iOS */
                @supports (padding-bottom: env(safe-area-inset-bottom)) {
                    .mobile-nav {
                        padding-bottom: env(safe-area-inset-bottom);
                        height: calc(70px + env(safe-area-inset-bottom));
                    }
                }
            `}</style>
    </nav>
  )
}
