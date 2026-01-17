'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingCart, User, Store } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function MobileNav() {
    const pathname = usePathname()
    const cartItemCount = useCartStore((state) => state.getTotalItems())

    const navItems = [
        { href: '/', icon: Home, label: 'Beranda' },
        { href: '/products', icon: Search, label: 'Cari' },
        { href: '/cart', icon: ShoppingCart, label: 'Keranjang', badge: cartItemCount },
        { href: '/seller', icon: Store, label: 'Toko' },
        { href: '/profile', icon: User, label: 'Akun' },
    ]

    return (
        <nav className="mobile-nav">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <div className="nav-icon-wrapper">
                            <Icon size={22} />
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                            )}
                        </div>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                )
            })}

            <style jsx>{`
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: var(--z-sticky);
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--bg-primary);
          padding: var(--space-2) 0;
          padding-bottom: calc(var(--space-2) + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
          border-top: 1px solid var(--gray-100);
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
          gap: var(--space-1);
          padding: var(--space-1) var(--space-3);
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .mobile-nav-item:active {
          transform: scale(0.95);
        }

        .mobile-nav-item.active {
          color: var(--primary-600);
        }

        .nav-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-badge {
          position: absolute;
          top: -6px;
          right: -10px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: var(--accent-red);
          color: white;
          font-size: 10px;
          font-weight: 700;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 500;
        }
      `}</style>
        </nav>
    )
}
