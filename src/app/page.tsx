'use client'

import Link from 'next/link'
import { ChevronRight, Truck, Shield, Clock, Store } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import BannerSlider from '@/components/ui/BannerSlider'
import CountdownTimer from '@/components/ui/CountdownTimer'
import {
    mockProducts,
    mockCategories,
    mockBanners,
    mockFlashSale,
    mockStores
} from '@/lib/mockData'

export default function HomePage() {
    return (
        <>
            <Header />

            <main className="main-content">
                {/* Hero Banner */}
                <section className="hero-section">
                    <div className="container">
                        <BannerSlider banners={mockBanners} />
                    </div>
                </section>

                {/* USP Bar */}
                <section className="usp-section">
                    <div className="container">
                        <div className="usp-grid">
                            <div className="usp-item">
                                <Truck size={24} />
                                <div className="usp-content">
                                    <strong>Pengiriman Cepat</strong>
                                    <span>Sampai dalam 1-2 jam</span>
                                </div>
                            </div>
                            <div className="usp-item">
                                <Shield size={24} />
                                <div className="usp-content">
                                    <strong>Pembayaran Aman</strong>
                                    <span>COD & Transfer</span>
                                </div>
                            </div>
                            <div className="usp-item">
                                <Clock size={24} />
                                <div className="usp-content">
                                    <strong>Buka 24 Jam</strong>
                                    <span>Pesan kapan saja</span>
                                </div>
                            </div>
                            <div className="usp-item">
                                <Store size={24} />
                                <div className="usp-content">
                                    <strong>UMKM Lokal</strong>
                                    <span>Dukung ekonomi daerah</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="categories-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Kategori</h2>
                            <Link href="/categories" className="see-all">
                                Lihat Semua <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="categories-grid">
                            {mockCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="category-item"
                                >
                                    <div className="category-icon">{category.icon}</div>
                                    <span className="category-name">{category.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Flash Sale */}
                <section className="flash-sale-section">
                    <div className="container">
                        <div className="flash-sale-header">
                            <div className="flash-sale-title">
                                <span className="flash-icon">⚡</span>
                                <h2>Flash Sale</h2>
                            </div>
                            <CountdownTimer endTime={mockFlashSale.end_time} />
                            <Link href="/flash-sale" className="see-all-btn">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="products-scroll">
                            {mockFlashSale.products.map((item) => (
                                item.product && (
                                    <div key={item.product_id} className="product-scroll-item">
                                        <ProductCard
                                            product={{
                                                ...item.product,
                                                discount_price: item.flash_price,
                                            }}
                                        />
                                        <div className="flash-progress">
                                            <div
                                                className="flash-progress-bar"
                                                style={{ width: `${(item.sold / item.stock) * 100}%` }}
                                            />
                                            <span className="flash-sold">Terjual {item.sold}</span>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </section>

                {/* Nearby Stores */}
                <section className="stores-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>🏪 Toko Terdekat</h2>
                            <Link href="/stores" className="see-all">
                                Lihat Semua <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="stores-grid">
                            {mockStores.map((store) => (
                                <Link key={store.id} href={`/store/${store.id}`} className="store-card">
                                    <div className="store-banner">
                                        <img src={store.banner_url || ''} alt={store.name} />
                                    </div>
                                    <div className="store-info">
                                        <img
                                            src={store.logo_url || ''}
                                            alt={store.name}
                                            className="store-logo"
                                        />
                                        <div className="store-details">
                                            <h3>
                                                {store.name}
                                                {store.is_verified && <span className="verified">✓</span>}
                                            </h3>
                                            <p className="store-meta">
                                                ⭐ {store.rating} • {store.distance} km • {store.total_products} produk
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Best Sellers */}
                <section className="products-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>🔥 Produk Terlaris</h2>
                            <Link href="/products?sort=bestseller" className="see-all">
                                Lihat Semua <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="products-grid">
                            {mockProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* New Products */}
                <section className="products-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>✨ Produk Terbaru</h2>
                            <Link href="/products?sort=newest" className="see-all">
                                Lihat Semua <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="products-grid">
                            {mockProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-card">
                            <div className="cta-content">
                                <h2>Punya Usaha? Mulai Jual di BELItangPEDIA!</h2>
                                <p>Jangkau lebih banyak pelanggan di Belitang dan sekitarnya. Gratis daftar, mulai jualan hari ini!</p>
                                <Link href="/seller/register" className="btn btn-primary btn-lg">
                                    Daftar Jadi Penjual
                                </Link>
                            </div>
                            <div className="cta-image">
                                🛍️
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <MobileNav />

            <style jsx>{`
        .main-content {
          min-height: 100vh;
          padding-bottom: 80px;
        }

        @media (min-width: 768px) {
          .main-content {
            padding-bottom: 0;
          }
        }

        .hero-section {
          padding: var(--space-4) 0;
        }

        /* USP Section */
        .usp-section {
          padding: var(--space-4) 0;
          background: var(--bg-primary);
        }

        .usp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        @media (min-width: 768px) {
          .usp-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .usp-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--gray-50);
          border-radius: var(--radius-lg);
          color: var(--primary-600);
        }

        .usp-content {
          display: flex;
          flex-direction: column;
        }

        .usp-content strong {
          font-size: var(--text-sm);
          color: var(--text-primary);
        }

        .usp-content span {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        /* Section Headers */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }

        .section-header h2 {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-primary);
        }

        .see-all {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--primary-600);
        }

        /* Categories Section */
        .categories-section {
          padding: var(--space-6) 0;
          background: var(--bg-primary);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-3);
        }

        @media (min-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(8, 1fr);
          }
        }

        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          text-align: center;
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .category-item:hover {
          transform: scale(1.05);
        }

        .category-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
          border-radius: var(--radius-xl);
          font-size: 24px;
          transition: all var(--transition-fast);
        }

        .category-item:hover .category-icon {
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
          box-shadow: var(--shadow-glow);
        }

        .category-name {
          font-size: var(--text-xs);
          font-weight: 500;
          color: var(--text-secondary);
        }

        /* Flash Sale Section */
        .flash-sale-section {
          padding: var(--space-6) 0;
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--accent-red) 100%);
        }

        .flash-sale-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }

        .flash-sale-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .flash-icon {
          font-size: 28px;
          animation: pulse 1s ease infinite;
        }

        .flash-sale-title h2 {
          color: white;
          font-size: var(--text-xl);
          font-weight: 700;
        }

        .see-all-btn {
          margin-left: auto;
          padding: var(--space-2) var(--space-4);
          background: white;
          color: var(--primary-600);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          font-weight: 600;
        }

        .products-scroll {
          display: flex;
          gap: var(--space-4);
          overflow-x: auto;
          padding: var(--space-2);
          margin: calc(var(--space-2) * -1);
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .products-scroll::-webkit-scrollbar {
          display: none;
        }

        .product-scroll-item {
          min-width: 180px;
          max-width: 180px;
          scroll-snap-align: start;
        }

        @media (min-width: 768px) {
          .product-scroll-item {
            min-width: 200px;
            max-width: 200px;
          }
        }

        .flash-progress {
          position: relative;
          margin-top: var(--space-2);
          height: 20px;
          background: var(--gray-200);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .flash-progress-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: linear-gradient(90deg, var(--accent-red) 0%, var(--accent-pink) 100%);
          border-radius: var(--radius-full);
        }

        .flash-sold {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Stores Section */
        .stores-section {
          padding: var(--space-6) 0;
          background: var(--bg-primary);
        }

        .stores-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        @media (min-width: 768px) {
          .stores-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .store-card {
          display: block;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          text-decoration: none;
          transition: all var(--transition-base);
        }

        .store-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .store-banner {
          height: 100px;
          background: var(--gray-200);
          overflow: hidden;
        }

        .store-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .store-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          margin-top: -30px;
          position: relative;
        }

        .store-logo {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-lg);
          border: 3px solid white;
          object-fit: cover;
          background: white;
          box-shadow: var(--shadow-md);
        }

        .store-details h3 {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .verified {
          color: var(--secondary-500);
          font-size: var(--text-xs);
        }

        .store-meta {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        /* Products Section */
        .products-section {
          padding: var(--space-6) 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* CTA Section */
        .cta-section {
          padding: var(--space-8) 0;
        }

        .cta-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          color: white;
        }

        .cta-content {
          max-width: 500px;
        }

        .cta-content h2 {
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: var(--space-3);
        }

        .cta-content p {
          font-size: var(--text-base);
          opacity: 0.9;
          margin-bottom: var(--space-4);
        }

        .cta-image {
          font-size: 80px;
          display: none;
        }

        @media (min-width: 768px) {
          .cta-image {
            display: block;
          }
        }
      `}</style>
        </>
    )
}
