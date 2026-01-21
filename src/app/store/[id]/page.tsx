'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, MessageCircle, Share2, Heart } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts, mockStores } from '@/lib/mockData'

export default function StorePage() {
    const params = useParams()
    const storeId = params.id as string
    const [activeTab, setActiveTab] = useState('products')
    const [isFollowing, setIsFollowing] = useState(false)

    // Find store
    const store = mockStores.find(s => s.id === storeId) || mockStores[0]
    const storeProducts = mockProducts.slice(0, 8)

    return (
        <>
            <Header />
            <main className="main-content">
                {/* Store Header */}
                <div className="store-header-wrapper">
                    <div className="container">
                        <Link href="/stores" className="back-btn">
                            <ArrowLeft size={20} />
                        </Link>

                        <div className="store-header">
                            <div className="store-avatar">
                                <img
                                    src={store.logo_url || 'https://via.placeholder.com/100'}
                                    alt={store.name}
                                />
                            </div>
                            <div className="store-info">
                                <h1>{store.name}</h1>
                                <div className="store-meta">
                                    <span className="rating">
                                        <Star size={14} fill="currentColor" />
                                        {store.rating}
                                    </span>
                                    <span className="divider">•</span>
                                    <span className="location">
                                        <MapPin size={14} />
                                        {store.distance} km
                                    </span>
                                </div>
                                <p className="store-desc">
                                    {store.description || 'Toko terpercaya di Belitang dengan produk berkualitas'}
                                </p>
                            </div>
                        </div>

                        <div className="store-actions">
                            <button
                                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                onClick={() => setIsFollowing(!isFollowing)}
                            >
                                <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
                                <span>{isFollowing ? 'Mengikuti' : 'Ikuti'}</span>
                            </button>
                            <button className="action-btn">
                                <MessageCircle size={16} />
                                <span>Chat</span>
                            </button>
                            <button className="action-btn">
                                <Share2 size={16} />
                            </button>
                        </div>

                        <div className="store-stats">
                            <div className="stat">
                                <span className="stat-value">{store.total_products || 50}+</span>
                                <span className="stat-label">Produk</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">98%</span>
                                <span className="stat-label">Respons</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">1-2 Hari</span>
                                <span className="stat-label">Pengiriman</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-wrapper">
                    <div className="container">
                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'products' ? 'active' : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                Produk
                            </button>
                            <button
                                className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Ulasan
                            </button>
                            <button
                                className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                                onClick={() => setActiveTab('about')}
                            >
                                Tentang
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="container tab-content">
                    {activeTab === 'products' && (
                        <div className="product-grid">
                            {storeProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-placeholder">
                            <p>Belum ada ulasan untuk toko ini.</p>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="about-section">
                            <h3>Tentang Toko</h3>
                            <p>{store.description || 'Toko terpercaya di Belitang yang menyediakan berbagai produk berkualitas dengan harga terjangkau.'}</p>
                            <h3>Lokasi</h3>
                            <p>Belitang, OKU Timur, Sumatera Selatan</p>
                            <h3>Jam Operasional</h3>
                            <p>Setiap hari, 08:00 - 21:00 WIB</p>
                        </div>
                    )}
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

        .store-header-wrapper {
          background: var(--bg-primary);
          padding: var(--space-4) 0;
        }

        .container {
          padding: 0 var(--space-4);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--gray-100);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }

        .store-header {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .store-avatar {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--gray-100);
          flex-shrink: 0;
        }

        .store-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .store-info h1 {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .store-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--accent-yellow);
        }

        .location {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .store-desc {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .store-actions {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .follow-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--primary-500);
          color: white;
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          font-weight: 600;
        }

        .follow-btn.following {
          background: var(--gray-200);
          color: var(--text-secondary);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--gray-100);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .store-stats {
          display: flex;
          justify-content: space-around;
          padding: var(--space-3) 0;
          border-top: 1px solid var(--border-light);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--primary-600);
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .tabs-wrapper {
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 60px;
          z-index: 10;
        }

        .tabs {
          display: flex;
        }

        .tab {
          flex: 1;
          padding: var(--space-3) var(--space-4);
          text-align: center;
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-tertiary);
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: var(--primary-600);
          border-bottom-color: var(--primary-600);
        }

        .tab-content {
          padding-top: var(--space-4);
          padding-bottom: var(--space-4);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        @media (min-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .reviews-placeholder,
        .about-section {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          text-align: center;
          color: var(--text-tertiary);
        }

        .about-section {
          text-align: left;
        }

        .about-section h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          margin-top: var(--space-4);
          margin-bottom: var(--space-2);
        }

        .about-section h3:first-child {
          margin-top: 0;
        }

        .about-section p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }
      `}</style>
        </>
    )
}
