'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  Store,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  Plus,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/mockData'
import { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']
type Order = Database['public']['Tables']['orders']['Row']

export default function SellerDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { store, fetchMyStore, isLoading: storeLoading, hasFetched } = useStoreStore()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  })

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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!store?.id) return

      setIsLoading(true)

      try {
        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', store.id)
          .order('total_sold', { ascending: false })
          .limit(5)

        setProducts(productsData || [])

        // Fetch recent orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false })
          .limit(5)

        setOrders(ordersData || [])

        // Calculate stats
        const { data: allOrders } = await supabase
          .from('orders')
          .select('total, status')
          .eq('store_id', store.id)

        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('store_id', store.id)

        // Cast to expected type
        const ordersForStats = (allOrders || []) as { total: number; status: string }[]

        const totalRevenue = ordersForStats
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (o.total || 0), 0)

        const pendingOrders = ordersForStats
          .filter(o => o.status === 'pending').length

        setStats({
          totalRevenue,
          totalOrders: ordersForStats.length,
          totalProducts: productCount || 0,
          pendingOrders,
        })


      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [store?.id])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'badge-warning',
      confirmed: 'badge-primary',
      processing: 'badge-primary',
      shipping: 'badge-primary',
      delivered: 'badge-success',
      completed: 'badge-success',
      cancelled: 'badge-error',
    }
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      confirmed: 'Dikonfirmasi',
      processing: 'Diproses',
      shipping: 'Dikirim',
      delivered: 'Terkirim',
      completed: 'Selesai',
      cancelled: 'Batal',
    }
    return <span className={`badge ${styles[status]}`}>{labels[status] || status}</span>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays < 7) return `${diffDays} hari lalu`
    return date.toLocaleDateString('id-ID')
  }

  // Show loading
  if (authLoading || storeLoading || !hasFetched) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner" size={48} />
        <p>Memuat dashboard...</p>
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

  // No store - should redirect
  if (!store) {
    return null
  }

  const statCards = [
    {
      label: 'Pendapatan',
      value: formatPrice(stats.totalRevenue),
      icon: Wallet,
      color: 'primary'
    },
    {
      label: 'Total Pesanan',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'secondary'
    },
    {
      label: 'Produk Aktif',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'tertiary'
    },
    {
      label: 'Pesanan Baru',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'warning'
    },
  ]

  return (
    <div className="seller-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">Seller Center</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Tutup sidebar">
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link href="/seller" className="nav-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/seller/products" className="nav-item">
            <Package size={20} />
            Produk
          </Link>
          <Link href="/seller/orders" className="nav-item">
            <ShoppingBag size={20} />
            Pesanan
            {stats.pendingOrders > 0 && (
              <span className="nav-badge">{stats.pendingOrders}</span>
            )}
          </Link>
          <Link href="/seller/wallet" className="nav-item">
            <Wallet size={20} />
            Dompet
          </Link>
          <Link href="/seller/settings" className="nav-item">
            <Settings size={20} />
            Pengaturan
          </Link>
        </nav>

        <div className="sidebar-store">
          {store.logo_url ? (
            <div className="store-logo-wrapper">
              <Image
                src={store.logo_url}
                alt={store.name}
                fill
                className="store-logo"
              />
            </div>
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
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
            <Menu size={24} />
          </button>
          <h1>Dashboard</h1>
          <div className="top-bar-actions">
            <Link href="/seller/products/new" className="btn btn-primary btn-sm">
              <Plus size={16} />
              Tambah Produk
            </Link>
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

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Orders */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>Pesanan Terbaru</h2>
              <Link href="/seller/orders" className="see-all">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
            <div className="orders-list">
              {isLoading ? (
                <div className="loading-inline">
                  <Loader2 className="spinner" size={24} />
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-inline">
                  <p>Belum ada pesanan</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
                      <span className="order-time">
                        <Clock size={12} /> {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="order-meta">
                      <span className="order-total">{formatPrice(order.total)}</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Top Products */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>Produk Terlaris</h2>
              <Link href="/seller/products" className="see-all">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
            <div className="products-list">
              {isLoading ? (
                <div className="loading-inline">
                  <Loader2 className="spinner" size={24} />
                </div>
              ) : products.length === 0 ? (
                <div className="empty-inline">
                  <p>Belum ada produk</p>
                  <Link href="/seller/products/new" className="btn btn-primary btn-sm">
                    <Plus size={14} /> Tambah Produk
                  </Link>
                </div>
              ) : (
                products.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <span className="product-rank">#{index + 1}</span>
                    <div className="product-image-wrapper">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <strong>{product.name}</strong>
                      <span>{formatPrice(product.discount_price || product.price)}</span>
                    </div>
                    <div className="product-stats">
                      <span className="sold">{product.total_sold || 0} terjual</span>
                      <span className="stock">Stok: {product.stock}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Quick Tips */}
        <section className="tips-card">
          <div className="tips-content">
            <h3>💡 Tips Meningkatkan Penjualan</h3>
            <p>Pastikan foto produk berkualitas tinggi dan deskripsi yang jelas untuk menarik lebih banyak pembeli.</p>
          </div>
          <Link href="/seller/guide" className="btn btn-secondary btn-sm">
            Pelajari Lebih Lanjut
          </Link>
        </section>
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
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: var(--space-1);
          transition: all var(--transition-fast);
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
        }

        @media (min-width: 1024px) {
          .main-content {
            margin-left: 0;
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

        /* Stats Grid */
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
          font-size: var(--text-lg);
          font-weight: 700;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }

        @media (min-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .dashboard-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .card-header h2 {
          font-size: var(--text-base);
          font-weight: 600;
        }

        .see-all {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          color: var(--primary-600);
          font-weight: 500;
        }

        .loading-inline,
        .empty-inline {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          color: var(--text-tertiary);
        }

        .loading-inline :global(.spinner) {
          animation: spin 1s linear infinite;
          color: var(--primary-500);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Orders List */
        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--border-light);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-info {
          display: flex;
          flex-direction: column;
        }

        .order-info strong {
          font-size: var(--text-sm);
        }

        .order-time {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .order-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--space-1);
        }

        .order-total {
          font-weight: 600;
        }

        .badge {
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 600;
        }

        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-primary {
          background: var(--primary-100);
          color: var(--primary-700);
        }

        .badge-success {
          background: var(--secondary-100);
          color: var(--secondary-700);
        }

        .badge-error {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Products List */
        .product-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--border-light);
        }

        .product-item:last-child {
          border-bottom: none;
        }

        .product-rank {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--primary-600);
          min-width: 24px;
        }

        .product-item img {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .product-item .no-image {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-info strong {
          font-size: var(--text-sm);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-info span {
          font-size: var(--text-sm);
          color: var(--primary-600);
          font-weight: 600;
        }

        .product-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: var(--text-xs);
        }

        .sold {
          color: var(--secondary-600);
          font-weight: 500;
        }

        .stock {
          color: var(--text-tertiary);
        }

        /* Tips Card */
        .tips-card {
          background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .tips-content h3 {
          font-size: var(--text-base);
          margin-bottom: var(--space-2);
        }

        .tips-content p {
          font-size: var(--text-sm);
          opacity: 0.9;
          max-width: 500px;
        }

        .tips-card .btn-secondary {
          background: white;
          color: var(--secondary-700);
          border: none;
        }

        .store-logo-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }

        .store-logo {
          object-fit: cover;
        }

        .product-image-wrapper {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }

        .product-image {
          object-fit: cover;
        }
      `}</style>
    </div>
  )
}
