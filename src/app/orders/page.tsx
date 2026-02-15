'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { useState } from 'react'

const orders = [
  {
    id: 'ORD001',
    date: '19 Jan 2026',
    status: 'shipping',
    statusText: 'Sedang Dikirim',
    items: [
      { name: 'Mie Ayam Khas Belitang', qty: 2, price: 30000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100' }
    ],
    total: 60000
  },
  {
    id: 'ORD002',
    date: '18 Jan 2026',
    status: 'processing',
    statusText: 'Diproses',
    items: [
      { name: 'Kopi Robusta OKU', qty: 1, price: 45000, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=100' }
    ],
    total: 45000
  },
  {
    id: 'ORD003',
    date: '15 Jan 2026',
    status: 'completed',
    statusText: 'Selesai',
    items: [
      { name: 'Kerupuk Kemplang', qty: 3, price: 25000, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100' }
    ],
    total: 75000
  }
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'processing', label: 'Diproses' },
    { id: 'shipping', label: 'Dikirim' },
    { id: 'completed', label: 'Selesai' }
  ]

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipping': return Truck
      case 'processing': return Clock
      case 'completed': return CheckCircle
      default: return Package
    }
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/profile" className="back-link">
              <ArrowLeft size={20} />
              <span>Profil</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="page-header">
            <h1>Pesanan Saya</h1>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="orders-list">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status)
                return (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <Package size={16} />
                        <span>{order.id}</span>
                      </div>
                      <div className={`order-status ${order.status}`}>
                        <StatusIcon size={14} />
                        <span>{order.statusText}</span>
                      </div>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-image-wrapper">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="item-image"
                            />
                          </div>
                          <div className="item-info">
                            <h3>{item.name}</h3>
                            <p>{item.qty} x {formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <span className="total-price">{formatPrice(order.total)}</span>
                      </div>
                      <Link href={`/orders/${order.id}`} className="detail-btn">
                        <span>Detail</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="empty-state">
                <Package size={64} />
                <h2>Belum Ada Pesanan</h2>
                <p>Pesanan Anda akan muncul di sini</p>
                <Link href="/products" className="btn btn-primary">
                  Mulai Belanja
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />

      <style jsx>{`
        .main-content {
          background: var(--bg-secondary);
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .container {
          padding: var(--space-4);
        }

        .breadcrumb {
          margin-bottom: var(--space-4);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .page-header {
          margin-bottom: var(--space-4);
        }

        .page-header h1 {
          font-size: var(--text-xl);
          font-weight: 700;
        }

        .tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          overflow-x: auto;
        }

        .tab {
          padding: var(--space-2) var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .tab.active {
          background: var(--primary-500);
          color: white;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .order-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border-light);
        }

        .order-id {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 600;
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 500;
        }

        .order-status.shipping {
          background: var(--secondary-100);
          color: var(--secondary-600);
        }

        .order-status.processing {
          background: var(--accent-yellow);
          color: white;
        }

        .order-status.completed {
          background: var(--secondary-600);
          color: white;
        }

        .order-items {
          padding: var(--space-4);
        }

        .order-item {
          display: flex;
          gap: var(--space-3);
        }

        .item-image {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-info h3 {
          font-size: var(--text-sm);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .item-info p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          border-top: 1px solid var(--border-light);
        }

        .order-total {
          font-size: var(--text-sm);
        }

        .total-price {
          font-weight: 700;
          color: var(--primary-600);
          margin-left: var(--space-2);
        }

        .detail-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--primary-600);
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: var(--space-12);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .empty-state svg {
          color: var(--gray-300);
          margin-bottom: var(--space-4);
        }

        .empty-state h2 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .empty-state p {
          color: var(--text-tertiary);
          margin-bottom: var(--space-6);
        }

        .item-image-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .item-image {
          object-fit: cover;
        }
      `}</style>
    </>
  )
}
