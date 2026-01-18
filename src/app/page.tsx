'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  MapPin,
  Star,
  Truck,
  Shield,
  Clock,
  Store,
  Zap,
  Heart,
  ShoppingCart,
  ArrowRight
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import BannerSlider from '@/components/ui/BannerSlider'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { mockProducts, mockStores, mockCategories, mockBanners, flashSaleEndTime } from '@/lib/mockData'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const flashSaleProducts = mockProducts.slice(0, 6)
  const bestsellerProducts = mockProducts.slice(0, 12)
  const newProducts = mockProducts.slice(2, 14)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <HomePageSkeleton />
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner Slider */}
        <section className="hero-section">
          <BannerSlider banners={mockBanners} />
        </section>

        {/* Features Bar */}
        <section className="container">
          <div className="features-bar">
            <div className="feature-item animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon">🚚</div>
              <div className="feature-text">
                <h4>Pengiriman Cepat</h4>
                <p>Sampai dalam 1-2 jam</p>
              </div>
            </div>
            <div className="feature-item animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">💰</div>
              <div className="feature-text">
                <h4>Pembayaran Aman</h4>
                <p>COD & Transfer</p>
              </div>
            </div>
            <div className="feature-item animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon">🕐</div>
              <div className="feature-text">
                <h4>Buka 24 Jam</h4>
                <p>Pesan kapan saja</p>
              </div>
            </div>
            <div className="feature-item animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon">🏪</div>
              <div className="feature-text">
                <h4>UMKM Lokal</h4>
                <p>Dukung ekonomi daerah</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">Kategori</h2>
            <Link href="/categories" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="category-grid">
            {mockCategories.map((category, index) => (
              <Link
                href={`/category/${category.slug}`}
                key={category.id}
                className="category-item animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="category-icon">{category.icon}</div>
                <span className="category-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section className="section container">
          <div className="flash-sale">
            <div className="flash-sale-header">
              <h2 className="flash-sale-title">
                <Zap size={24} />
                <span>⚡</span> Flash Sale
              </h2>
              <div className="flash-countdown">
                <span className="countdown-label">Berakhir dalam</span>
                <CountdownTimer targetDate={flashSaleEndTime} />
              </div>
            </div>
            <div className="product-grid">
              {flashSaleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showDiscount
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
              <Link href="/flash-sale" className="btn btn-primary">
                Lihat Semua Flash Sale <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Nearby Stores */}
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">🏪 Toko Terdekat</h2>
            <Link href="/stores" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="stores-scroll hide-scrollbar">
            {mockStores.map((store, index) => (
              <Link
                href={`/store/${store.id}`}
                key={store.id}
                className="store-card animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="store-logo">
                  <img src={store.logo_url || 'https://via.placeholder.com/48'} alt={store.name} />
                </div>
                <div className="store-info">
                  <h4 className="store-name">{store.name}</h4>
                  <div className="store-location">
                    <MapPin size={12} />
                    <span>{store.distance} km</span>
                    <span>•</span>
                    <Star size={12} fill="currentColor" />
                    <span>{store.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <style jsx>{`
                        .stores-scroll {
                            display: flex;
                            gap: var(--space-4);
                            overflow-x: auto;
                            padding-bottom: var(--space-2);
                        }
                        .stores-scroll .store-card {
                            flex-shrink: 0;
                            min-width: 220px;
                        }
                    `}</style>
        </section>

        {/* Bestsellers */}
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">🔥 Produk Terlaris</h2>
            <Link href="/products?sort=bestseller" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {bestsellerProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                showBadge="bestseller"
                animationDelay={index * 0.05}
              />
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="container" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="promo-banner">
            <div className="promo-content">
              <h3>Mulai Berjualan Sekarang!</h3>
              <p>Buka toko gratis dan jangkau ribuan pelanggan di Belitang</p>
              <Link href="/seller" className="btn btn-primary">
                Daftar Jadi Seller <ArrowRight size={18} />
              </Link>
            </div>
            <div className="promo-image">
              <span>🛍️</span>
            </div>
          </div>

          <style jsx>{`
                        .promo-banner {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: var(--space-8);
                            background: linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%);
                            border-radius: var(--radius-2xl);
                            color: white;
                            overflow: hidden;
                        }
                        .promo-content h3 {
                            font-family: var(--font-display);
                            font-size: var(--text-2xl);
                            font-weight: 700;
                            margin-bottom: var(--space-2);
                        }
                        .promo-content p {
                            opacity: 0.9;
                            margin-bottom: var(--space-6);
                        }
                        .promo-image {
                            font-size: 80px;
                            animation: float 3s ease-in-out infinite;
                        }
                        @media (max-width: 768px) {
                            .promo-banner {
                                flex-direction: column;
                                text-align: center;
                                padding: var(--space-6);
                            }
                            .promo-image {
                                order: -1;
                                margin-bottom: var(--space-4);
                                font-size: 60px;
                            }
                        }
                    `}</style>
        </section>

        {/* New Arrivals */}
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">✨ Produk Terbaru</h2>
            <Link href="/products?sort=newest" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {newProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                showBadge="new"
                animationDelay={index * 0.05}
              />
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              Mengapa Belanja di BELItangPEDIA?
            </h2>
            <div className="trust-grid">
              <div className="trust-item">
                <div className="trust-icon">🛡️</div>
                <h4>100% Aman</h4>
                <p>Transaksi terjamin dengan sistem COD</p>
              </div>
              <div className="trust-item">
                <div className="trust-icon">⭐</div>
                <h4>Produk Berkualitas</h4>
                <p>Dari seller terpercaya di Belitang</p>
              </div>
              <div className="trust-item">
                <div className="trust-icon">🚀</div>
                <h4>Pengiriman Kilat</h4>
                <p>Sampai dalam hitungan jam</p>
              </div>
              <div className="trust-item">
                <div className="trust-icon">💬</div>
                <h4>Dukungan 24/7</h4>
                <p>Tim support siap membantu</p>
              </div>
            </div>
          </div>

          <style jsx>{`
                        .trust-section {
                            background: var(--bg-gradient-soft);
                            padding: var(--space-12) 0;
                        }
                        .trust-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: var(--space-6);
                        }
                        @media (min-width: 768px) {
                            .trust-grid {
                                grid-template-columns: repeat(4, 1fr);
                            }
                        }
                        .trust-item {
                            text-align: center;
                        }
                        .trust-icon {
                            font-size: 48px;
                            margin-bottom: var(--space-3);
                        }
                        .trust-item h4 {
                            font-size: var(--text-base);
                            font-weight: 600;
                            margin-bottom: var(--space-2);
                        }
                        .trust-item p {
                            font-size: var(--text-sm);
                            color: var(--text-secondary);
                        }
                    `}</style>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}

// Skeleton Loading Component
function HomePageSkeleton() {
  return (
    <>
      <Header />
      <main>
        {/* Banner Skeleton */}
        <div className="container" style={{ paddingTop: 'var(--space-4)' }}>
          <div className="skeleton skeleton-image" style={{ borderRadius: 'var(--radius-2xl)', height: '300px' }} />
        </div>

        {/* Features Skeleton */}
        <div className="container" style={{ marginTop: 'var(--space-6)' }}>
          <div className="features-bar">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="container section">
          <div className="skeleton skeleton-title" style={{ width: '200px', height: '32px', marginBottom: 'var(--space-6)' }} />
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card">
                <div className="skeleton skeleton-image" />
                <div style={{ padding: 'var(--space-4)' }}>
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
