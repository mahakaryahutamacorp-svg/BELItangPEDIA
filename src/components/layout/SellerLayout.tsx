'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Wallet,
    Settings,
    Store,
    Star,
    Menu,
    X,
    Loader2,
    Home
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'

interface SellerLayoutProps {
    children: React.ReactNode
    title: string
    actions?: React.ReactNode
    pendingOrders?: number
}

export default function SellerLayout({ children, title, actions, pendingOrders = 0 }: SellerLayoutProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { store, fetchMyStore, isLoading: storeLoading, hasFetched } = useStoreStore()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Fetch store
    useEffect(() => {
        if (user?.id) {
            fetchMyStore(user.id)
        }
    }, [user?.id, fetchMyStore])

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?redirect=/seller')
        }
    }, [user, authLoading, router])

    // Redirect if no store (after fetch completed)
    useEffect(() => {
        if (hasFetched && !storeLoading && user && !store) {
            router.push('/seller/register')
        }
    }, [store, storeLoading, hasFetched, user, router])

    const navItems = [
        { href: '/seller', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/seller/products', label: 'Produk', icon: Package },
        { href: '/seller/orders', label: 'Pesanan', icon: ShoppingBag, badge: pendingOrders },
        { href: '/seller/wallet', label: 'Dompet', icon: Wallet },
        { href: '/seller/settings', label: 'Pengaturan', icon: Settings },
    ]

    const isActive = (href: string) => {
        if (href === '/seller') {
            return pathname === '/seller'
        }
        return pathname.startsWith(href)
    }

    // Show loading
    if (authLoading || storeLoading || !hasFetched) {
        return (
            <div className="seller-loading">
                <Loader2 className="spinner" size={48} />
                <p>Memuat dashboard...</p>
                <style jsx>{`
          .seller-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--bg-secondary);
          }
          .seller-loading :global(.spinner) {
            animation: spin 1s linear infinite;
            color: var(--primary-500);
            margin-bottom: var(--space-4);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        )
    }

    // No store - should redirect
    if (!store) {
        return null
    }

    return (
        <div className="seller-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/" className="logo">
                        <span className="logo-icon">🛒</span>
                        <span className="logo-text">Seller Center</span>
                    </Link>
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            {item.label}
                            {item.badge && item.badge > 0 && (
                                <span className="nav-badge">{item.badge}</span>
                            )}
                        </Link>
                    ))}
                    <div className="nav-divider" />
                    <Link href="/" className="nav-item">
                        <Home size={20} />
                        Kembali ke Beranda
                    </Link>
                </nav>

                <div className="sidebar-store">
                    {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="store-logo" />
                    ) : (
                        <div className="store-logo-placeholder">
                            <Store size={20} />
                        </div>
                    )}
                    <div className="store-info">
                        <strong>{store.name}</strong>
                        <span>
                            <Star size={12} fill="currentColor" /> {store.rating || '0.0'}
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <h1>{title}</h1>
                    {actions && <div className="top-bar-actions">{actions}</div>}
                </header>

                {children}
            </main>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <style jsx>{`
        .seller-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: var(--bg-primary);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: var(--z-modal);
          transform: translateX(-100%);
          transition: transform var(--transition-base);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        @media (min-width: 1024px) {
          .sidebar {
            position: sticky;
            top: 0;
            height: 100vh;
            transform: translateX(0);
          }
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: calc(var(--z-modal) - 1);
        }

        @media (min-width: 1024px) {
          .sidebar-overlay {
            display: none;
          }
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-light);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
        }

        .logo-icon {
          font-size: 24px;
        }

        .logo-text {
          font-weight: 700;
          color: var(--text-primary);
        }

        .sidebar-close {
          display: block;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
        }

        @media (min-width: 1024px) {
          .sidebar-close {
            display: none;
          }
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-4);
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: var(--space-1);
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .nav-item:hover {
          background: var(--gray-100);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--primary-50);
          color: var(--primary-600);
        }

        .nav-badge {
          margin-left: auto;
          padding: 2px 8px;
          background: var(--accent-red);
          color: white;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
        }

        .nav-divider {
          height: 1px;
          background: var(--border-light);
          margin: var(--space-4) 0;
        }

        .sidebar-store {
          padding: var(--space-4);
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .store-logo {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .store-logo-placeholder {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
        }

        .store-info {
          display: flex;
          flex-direction: column;
        }

        .store-info strong {
          font-size: var(--text-sm);
        }

        .store-info span {
          font-size: var(--text-xs);
          color: var(--accent-yellow);
          display: flex;
          align-items: center;
          gap: 2px;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: var(--space-6);
          overflow-x: hidden;
          min-width: 0;
        }

        @media (max-width: 767px) {
          .main-content {
            padding: var(--space-4);
            padding-bottom: 100px;
          }
        }

        .top-bar {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .menu-toggle {
          display: block;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
        }

        @media (min-width: 1024px) {
          .menu-toggle {
            display: none;
          }
        }

        .top-bar h1 {
          flex: 1;
          font-size: var(--text-xl);
          font-weight: 700;
        }

        .top-bar-actions {
          display: flex;
          gap: var(--space-2);
        }
      `}</style>
        </div>
    )
}
