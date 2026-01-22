'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Image,
  Users,
  Store,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Loader2,
  Shield
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return

      try {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single() as { data: { role: string } | null }

        if (userData?.role === 'admin') {
          setIsAdmin(true)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Error checking admin:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/admin')
      } else {
        checkAdmin()
      }
    }
  }, [user, authLoading, router])

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return

      try {
        const [usersRes, storesRes, productsRes, ordersRes] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('stores').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('status') as unknown as Promise<{ data: { status: string }[] | null }>,
        ])

        const pendingOrders = (ordersRes.data || []).filter((o: { status: string }) => o.status === 'pending').length

        setStats({
          totalUsers: usersRes.count || 0,
          totalStores: storesRes.count || 0,
          totalProducts: productsRes.count || 0,
          totalOrders: ordersRes.data?.length || 0,
          pendingOrders,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [isAdmin])

  if (authLoading || isLoading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner" size={48} />
        <p>Memuat admin dashboard...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--bg-secondary);
          }
          .loading-container :global(.spinner) {
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

  if (!isAdmin) {
    return null
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', active: true },
    { label: 'Banners', icon: Image, href: '/admin/banners' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Stores', icon: Store, href: '/admin/stores' },
    { label: 'Products', icon: Package, href: '/admin/products' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'primary' },
    { label: 'Total Stores', value: stats.totalStores, icon: Store, color: 'secondary' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'tertiary' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: ShoppingBag, color: 'warning' },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/admin" className="logo">
            <Shield size={24} />
            <span className="logo-text">Admin Panel</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="nav-item">
            <LogOut size={20} />
            Kembali ke Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>{user?.email}</span>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link href="/admin/banners" className="action-card">
              <Image size={32} />
              <span>Kelola Banners</span>
              <ChevronRight size={20} />
            </Link>
            <Link href="/admin/users" className="action-card">
              <Users size={32} />
              <span>Kelola Users</span>
              <ChevronRight size={20} />
            </Link>
            <Link href="/admin/stores" className="action-card">
              <Store size={32} />
              <span>Verifikasi Stores</span>
              <ChevronRight size={20} />
            </Link>
            <Link href="/admin/orders" className="action-card">
              <ShoppingBag size={32} />
              <span>Lihat Orders</span>
              <ChevronRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: white;
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: white;
        }

        .logo-text {
          font-weight: 700;
          font-size: var(--text-lg);
        }

        .sidebar-close {
          color: white;
          opacity: 0.7;
        }

        @media (min-width: 1024px) {
          .sidebar-close {
            display: none;
          }
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-4);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          margin-bottom: var(--space-1);
          transition: all var(--transition-fast);
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .sidebar-footer {
          padding: var(--space-4);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .main-content {
          flex: 1;
          padding: var(--space-6);
        }

        .top-bar {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .menu-toggle {
          color: var(--text-secondary);
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

        .user-info {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          display: flex;
          gap: var(--space-3);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-100);
          color: var(--primary-600);
          border-radius: var(--radius-lg);
        }

        .stat-card.secondary .stat-icon {
          background: var(--secondary-100);
          color: var(--secondary-600);
        }

        .stat-card.tertiary .stat-icon {
          background: var(--gray-100);
          color: var(--text-secondary);
        }

        .stat-card.warning .stat-icon {
          background: #fef3c7;
          color: #92400e;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .stat-value {
          font-size: var(--text-2xl);
          font-weight: 700;
        }

        .quick-actions {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
        }

        .quick-actions h2 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        @media (min-width: 768px) {
          .actions-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
          background: var(--gray-50);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          text-align: center;
          transition: all var(--transition-fast);
        }

        .action-card:hover {
          background: var(--primary-50);
          color: var(--primary-600);
        }

        .action-card span {
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .action-card :global(svg:last-child) {
          display: none;
        }
      `}</style>
    </div>
  )
}
