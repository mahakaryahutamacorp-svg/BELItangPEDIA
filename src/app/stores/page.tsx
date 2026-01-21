'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Store } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { mockStores } from '@/lib/mockData'

export default function StoresPage() {
    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <Link href="/" className="back-link">
                            <ArrowLeft size={20} />
                            <span>Kembali</span>
                        </Link>
                    </div>

                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-icon">
                            <Store size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Toko di Sekitarmu</h1>
                            <p>Temukan toko lokal terpercaya di Belitang</p>
                        </div>
                    </div>

                    {/* Stores Grid */}
                    <div className="stores-grid">
                        {mockStores.map((store) => (
                            <Link href={`/store/${store.id}`} key={store.id} className="store-card">
                                <div className="store-header">
                                    <div className="store-avatar">
                                        <img
                                            src={store.logo_url || 'https://via.placeholder.com/80'}
                                            alt={store.name}
                                        />
                                    </div>
                                    <div className="store-badge">
                                        <Star size={12} fill="currentColor" />
                                        <span>{store.rating}</span>
                                    </div>
                                </div>
                                <div className="store-info">
                                    <h3>{store.name}</h3>
                                    <p className="store-location">
                                        <MapPin size={12} />
                                        <span>{store.distance} km dari lokasi Anda</span>
                                    </p>
                                    <p className="store-products">{store.total_products || 50}+ produk</p>
                                </div>
                                <button className="visit-btn">Kunjungi Toko</button>
                            </Link>
                        ))}
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
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          padding: var(--space-6);
          background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
          border-radius: var(--radius-xl);
          color: white;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-xl);
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-text h1 {
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .stores-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: var(--space-4);
        }

        @media (min-width: 640px) {
          .stores-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stores-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .store-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .store-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .store-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }

        .store-avatar {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--gray-100);
        }

        .store-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .store-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: var(--space-1) var(--space-2);
          background: var(--accent-yellow);
          color: white;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .store-info h3 {
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .store-location {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-bottom: var(--space-1);
        }

        .store-products {
          font-size: var(--text-sm);
          color: var(--primary-600);
          font-weight: 500;
        }

        .visit-btn {
          width: 100%;
          margin-top: var(--space-3);
          padding: var(--space-3);
          background: var(--primary-50);
          color: var(--primary-600);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .visit-btn:hover {
          background: var(--primary-100);
        }
      `}</style>
        </>
    )
}
