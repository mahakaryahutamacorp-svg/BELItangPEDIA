'use client'

import { useState } from 'react'
import Link from 'next/link'
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
    Eye,
    Star,
    ArrowUpRight,
    ArrowDownRight,
    Menu,
    X
} from 'lucide-react'
import { formatPrice, mockProducts, mockStores } from '@/lib/mockData'

const store = mockStores[0]

export default function SellerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const stats = [
        { label: 'Pendapatan Bulan Ini', value: formatPrice(12500000), change: '+12%', up: true, icon: Wallet },
        { label: 'Total Pesanan', value: '156', change: '+8%', up: true, icon: ShoppingBag },
        { label: 'Produk Aktif', value: '45', change: '+3', up: true, icon: Package },
        { label: 'Pengunjung', value: '1.2rb', change: '-5%', up: false, icon: Users },
    ]

    const recentOrders = [
        { id: 'ORD001', customer: 'Ahmad Fauzi', product: 'Beras Premium 5kg', total: 75000, status: 'pending', time: '5 menit lalu' },
        { id: 'ORD002', customer: 'Siti Nurhaliza', product: 'Minyak Goreng 2L', total: 32000, status: 'processing', time: '15 menit lalu' },
        { id: 'ORD003', customer: 'Budi Santoso', product: 'Kaos Polos Premium', total: 69000, status: 'shipping', time: '1 jam lalu' },
        { id: 'ORD004', customer: 'Dewi Lestari', product: 'Beras Premium 5kg x2', total: 150000, status: 'completed', time: '2 jam lalu' },
    ]

    const topProducts = mockProducts.slice(0, 4)

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'badge-warning',
            processing: 'badge-primary',
            shipping: 'badge-primary',
            completed: 'badge-success',
            cancelled: 'badge-error',
        }
        const labels: Record<string, string> = {
            pending: 'Menunggu',
            processing: 'Diproses',
            shipping: 'Dikirim',
            completed: 'Selesai',
            cancelled: 'Batal',
        }
        return <span className={`badge ${styles[status]}`}>{labels[status]}</span>
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
                        <span className="nav-badge">5</span>
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
                    <img src={store.logo_url || ''} alt={store.name} className="store-logo" />
                    <div className="store-info">
                        <strong>{store.name}</strong>
                        <span>
                            <Star size={12} fill="currentColor" /> {store.rating}
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
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-icon">
                                <stat.icon size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">{stat.label}</span>
                                <span className="stat-value">{stat.value}</span>
                                <span className={`stat-change ${stat.up ? 'up' : 'down'}`}>
                                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </span>
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
                            {recentOrders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-info">
                                        <strong>{order.id}</strong>
                                        <span>{order.customer}</span>
                                        <span className="order-product">{order.product}</span>
                                    </div>
                                    <div className="order-meta">
                                        <span className="order-total">{formatPrice(order.total)}</span>
                                        {getStatusBadge(order.status)}
                                        <span className="order-time">
                                            <Clock size={12} /> {order.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
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
                            {topProducts.map((product, index) => (
                                <div key={product.id} className="product-item">
                                    <span className="product-rank">#{index + 1}</span>
                                    <img src={product.images[0]} alt={product.name} />
                                    <div className="product-info">
                                        <strong>{product.name}</strong>
                                        <span>{formatPrice(product.discount_price || product.price)}</span>
                                    </div>
                                    <div className="product-stats">
                                        <span className="sold">{product.total_sold} terjual</span>
                                        <span className="stock">Stok: {product.stock}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Quick Tips */}
                <section className="tips-card">
                    <div className="tips-content">
                        <h3>💡 Tips Meningkatkan Penjualan</h3>
                        <p>Pastikan foto produk berkualitas tinggi dan deskripsi yang jelas untuk menarik lebih banyak pembeli.</p>
                    </div>
                    <Link href="/help/seller" className="btn btn-secondary btn-sm">
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

        .stat-change {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .stat-change.up {
          color: var(--secondary-600);
        }

        .stat-change.down {
          color: var(--accent-red);
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

        .order-info span {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .order-product {
          color: var(--text-secondary) !important;
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

        .order-time {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: 10px;
          color: var(--text-tertiary);
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
      `}</style>
        </div>
    )
}
