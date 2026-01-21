'use client'

import Link from 'next/link'
import { ArrowLeft, Percent, Tag, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts } from '@/lib/mockData'

export default function PromoPage() {
  const promoProducts = mockProducts.filter(p => p.discount_price && p.discount_price > 0)

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
            <div className="header-icon promo">
              <Percent size={32} />
            </div>
            <div className="header-text">
              <h1>Promo Spesial</h1>
              <p>Temukan berbagai penawaran menarik dengan diskon hingga 70%!</p>
            </div>
          </div>

          {/* Promo Banners */}
          <div className="promo-banners">
            <div className="promo-banner banner-1">
              <Tag size={24} />
              <div>
                <h3>Diskon s.d 50%</h3>
                <p>Produk Fashion</p>
              </div>
            </div>
            <div className="promo-banner banner-2">
              <Clock size={24} />
              <div>
                <h3>Promo Terbatas</h3>
                <p>Hari Ini Saja!</p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <section className="products-section">
            <h2 className="section-title">Produk Promo</h2>
            <div className="product-grid">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} showDiscount />
              ))}
            </div>
          </section>
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

        .back-link:hover {
          color: var(--primary-600);
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          padding: var(--space-6);
          background: linear-gradient(135deg, #EF4444, #DC2626);
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

        .header-text p {
          opacity: 0.9;
          font-size: var(--text-sm);
        }

        .promo-banners {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .promo-banner {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
          color: white;
        }

        .banner-1 {
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
        }

        .banner-2 {
          background: linear-gradient(135deg, #F59E0B, #D97706);
        }

        .promo-banner h3 {
          font-size: var(--text-sm);
          font-weight: 700;
        }

        .promo-banner p {
          font-size: var(--text-xs);
          opacity: 0.9;
        }

        .products-section {
          background: var(--bg-primary);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
        }

        .section-title {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-4);
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
      `}</style>
    </>
  )
}
