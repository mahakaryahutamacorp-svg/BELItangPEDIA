'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  MapPin,
  Star,
  Zap,
  ArrowRight,
  Percent,
  Truck,
  Gift,
  CreditCard
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import BannerSlider from '@/components/ui/BannerSlider'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { mockProducts, mockStores, mockCategories, mockBanners, flashSaleEndTime } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import { Banner } from '@/types'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [banners, setBanners] = useState<Banner[]>(mockBanners)
  const flashSaleProducts = mockProducts.slice(0, 6)
  const bestsellerProducts = mockProducts.slice(0, 10)
  const newProducts = mockProducts.slice(2, 12)

  useEffect(() => {
    setMounted(true)
    // Fetch banners from Supabase
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true })

      if (!error && data && data.length > 0) {
        setBanners(data)
      }
    } catch (error) {
      console.log('Using mock banners')
    }
  }

  if (!mounted) {
    return <HomePageSkeleton />
  }

  return (
    <>
      <Header />
      <main className="main-content">
        {/* Banner Slider - Compact */}
        <section className="banner-section">
          <BannerSlider banners={banners} />
        </section>

        {/* Quick Menu - Tokopedia Style */}
        <section className="quick-menu">
          <div className="quick-menu-grid">
            <Link href="/promo" className="quick-menu-item">
              <div className="quick-icon promo">
                <Percent size={20} />
              </div>
              <span>Promo</span>
            </Link>
            <Link href="/flash-sale" className="quick-menu-item">
              <div className="quick-icon flash">
                <Zap size={20} />
              </div>
              <span>Flash Sale</span>
            </Link>
            <Link href="/gratis-ongkir" className="quick-menu-item">
              <div className="quick-icon shipping">
                <Truck size={20} />
              </div>
              <span>Gratis Ongkir</span>
            </Link>
            <Link href="/voucher" className="quick-menu-item">
              <div className="quick-icon voucher">
                <Gift size={20} />
              </div>
              <span>Voucher</span>
            </Link>
            <Link href="/cod" className="quick-menu-item">
              <div className="quick-icon cod">
                <CreditCard size={20} />
              </div>
              <span>COD</span>
            </Link>
          </div>
        </section>

        {/* Categories - Horizontal Scroll */}
        <section className="category-section">
          <div className="section-header container">
            <h2 className="section-title">Kategori</h2>
            <Link href="/categories" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="category-scroll hide-scrollbar">
            {mockCategories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category.id}
                className="category-chip"
              >
                <span className="category-emoji">{category.icon}</span>
                <span className="category-label">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale - Tokopedia Style */}
        <section className="flash-sale-section">
          <div className="container">
            <div className="flash-sale-card">
              <div className="flash-header">
                <div className="flash-title">
                  <Zap size={20} className="flash-icon" />
                  <span>Flash Sale</span>
                </div>
                <div className="flash-timer">
                  <span className="timer-label">Berakhir dalam</span>
                  <CountdownTimer targetDate={flashSaleEndTime} />
                </div>
                <Link href="/flash-sale" className="flash-link">
                  Lihat Semua <ChevronRight size={16} />
                </Link>
              </div>
              <div className="flash-products hide-scrollbar">
                {flashSaleProducts.map((product) => (
                  <div key={product.id} className="flash-product-item">
                    <ProductCard product={product} showDiscount showBadge="flash" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Nearby Stores */}
        <section className="stores-section container">
          <div className="section-header">
            <h2 className="section-title">🏪 Toko di Sekitarmu</h2>
            <Link href="/stores" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="stores-grid hide-scrollbar">
            {mockStores.map((store) => (
              <Link href={`/store/${store.id}`} key={store.id} className="store-chip">
                <div className="store-avatar">
                  <img src={store.logo_url || 'https://via.placeholder.com/40'} alt={store.name} />
                </div>
                <div className="store-info">
                  <span className="store-name">{store.name}</span>
                  <span className="store-meta">
                    <MapPin size={10} />
                    {store.distance} km • <Star size={10} fill="currentColor" /> {store.rating}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bestseller Products */}
        <section className="products-section container">
          <div className="section-header">
            <h2 className="section-title">🔥 Produk Terlaris</h2>
            <Link href="/products?sort=bestseller" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} showBadge="bestseller" />
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="promo-section container">
          <Link href="/seller" className="promo-card">
            <div className="promo-content">
              <span className="promo-emoji">🛍️</span>
              <div className="promo-text">
                <h3>Mulai Berjualan</h3>
                <p>Buka toko gratis, jangkau ribuan pelanggan!</p>
              </div>
            </div>
            <ArrowRight size={20} />
          </Link>
        </section>

        {/* New Products */}
        <section className="products-section container">
          <div className="section-header">
            <h2 className="section-title">✨ Produk Terbaru</h2>
            <Link href="/products?sort=newest" className="section-link">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} showBadge="new" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />

      <style jsx>{`
                .main-content {
                    background: var(--bg-secondary);
                    min-height: 100vh;
                }

                /* Banner Section */
                .banner-section {
                    background: var(--bg-primary);
                }

                /* Quick Menu - Tokopedia Style */
                .quick-menu {
                    background: var(--bg-primary);
                    padding: var(--space-4);
                    border-bottom: 1px solid var(--border-light);
                }

                .quick-menu-grid {
                    display: flex;
                    justify-content: space-around;
                    gap: var(--space-2);
                }

                .quick-menu-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-1);
                    text-decoration: none;
                }

                .quick-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .quick-icon.promo { background: linear-gradient(135deg, #EF4444, #DC2626); }
                .quick-icon.flash { background: linear-gradient(135deg, #F59E0B, #D97706); }
                .quick-icon.shipping { background: linear-gradient(135deg, #10B981, #059669); }
                .quick-icon.voucher { background: linear-gradient(135deg, #8B5CF6, #7C3AED); }
                .quick-icon.cod { background: linear-gradient(135deg, #3B82F6, #2563EB); }

                .quick-menu-item span:last-child {
                    font-size: 10px;
                    font-weight: 500;
                    color: var(--text-secondary);
                }

                /* Category Section */
                .category-section {
                    background: var(--bg-primary);
                    padding: var(--space-4) 0;
                    margin-bottom: var(--space-2);
                }

                .category-scroll {
                    display: flex;
                    gap: var(--space-2);
                    overflow-x: auto;
                    padding: 0 var(--space-4);
                }

                .category-chip {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: var(--gray-100);
                    border-radius: var(--radius-full);
                    white-space: nowrap;
                    font-size: var(--text-sm);
                    font-weight: 500;
                    color: var(--text-primary);
                    transition: all var(--transition-fast);
                }

                .category-chip:hover {
                    background: var(--primary-100);
                    color: var(--primary-700);
                }

                .category-emoji {
                    font-size: 18px;
                }

                /* Flash Sale Section */
                .flash-sale-section {
                    padding: var(--space-4) 0;
                }

                .flash-sale-card {
                    background: linear-gradient(135deg, #FEF3C7, #FDE68A);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                }

                .flash-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-3) var(--space-4);
                    flex-wrap: wrap;
                    gap: var(--space-2);
                }

                .flash-title {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-weight: 700;
                    font-size: var(--text-base);
                    color: var(--gray-900);
                }

                .flash-icon {
                    color: var(--accent-yellow);
                }

                .flash-timer {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                }

                .timer-label {
                    font-size: var(--text-xs);
                    color: var(--gray-600);
                    display: none;
                }

                @media (min-width: 640px) {
                    .timer-label {
                        display: block;
                    }
                }

                .flash-link {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    font-size: var(--text-xs);
                    font-weight: 600;
                    color: var(--primary-600);
                }

                .flash-products {
                    display: flex;
                    gap: var(--space-3);
                    overflow-x: auto;
                    padding: var(--space-3) var(--space-4);
                    background: white;
                }

                .flash-product-item {
                    flex-shrink: 0;
                    width: 140px;
                }

                @media (min-width: 640px) {
                    .flash-product-item {
                        width: 160px;
                    }
                }

                /* Stores Section */
                .stores-section {
                    padding: var(--space-4) var(--space-4);
                    background: var(--bg-primary);
                    margin-bottom: var(--space-2);
                }

                .stores-grid {
                    display: flex;
                    gap: var(--space-3);
                    overflow-x: auto;
                }

                .store-chip {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-3);
                    background: var(--gray-50);
                    border-radius: var(--radius-xl);
                    min-width: 200px;
                    flex-shrink: 0;
                }

                .store-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    background: var(--gray-200);
                }

                .store-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .store-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .store-name {
                    font-size: var(--text-sm);
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .store-meta {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    color: var(--text-tertiary);
                }

                .store-meta svg {
                    color: var(--accent-yellow);
                }

                /* Products Section */
                .products-section {
                    padding: var(--space-4);
                    background: var(--bg-primary);
                    margin-bottom: var(--space-2);
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-4);
                }

                .section-title {
                    font-size: var(--text-base);
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .section-link {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    font-size: var(--text-xs);
                    font-weight: 600;
                    color: var(--primary-600);
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

                @media (min-width: 1024px) {
                    .product-grid {
                        grid-template-columns: repeat(5, 1fr);
                    }
                }

                /* Promo Section */
                .promo-section {
                    padding: var(--space-4);
                }

                .promo-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-4);
                    background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
                    border-radius: var(--radius-xl);
                    color: white;
                }

                .promo-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }

                .promo-emoji {
                    font-size: 32px;
                }

                .promo-text h3 {
                    font-size: var(--text-base);
                    font-weight: 700;
                }

                .promo-text p {
                    font-size: var(--text-sm);
                    opacity: 0.9;
                }
            `}</style>
    </>
  )
}

// Skeleton Loading
function HomePageSkeleton() {
  return (
    <>
      <Header />
      <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
        <div className="container" style={{ padding: 'var(--space-4)' }}>
          <div className="skeleton" style={{ height: '150px', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-4)' }} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton" style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
