'use client'

import Link from 'next/link'
import { ArrowLeft, Zap, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { mockProducts, flashSaleEndTime } from '@/lib/mockData'

export default function FlashSalePage() {
    const flashSaleProducts = mockProducts.slice(0, 12)

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
                        <div className="header-top">
                            <div className="header-title">
                                <Zap size={28} className="flash-icon" />
                                <h1>Flash Sale</h1>
                            </div>
                            <div className="timer-box">
                                <Clock size={16} />
                                <span>Berakhir dalam</span>
                                <CountdownTimer targetDate={flashSaleEndTime} />
                            </div>
                        </div>
                        <p className="header-desc">
                            Diskon gila-gilaan! Buruan sebelum kehabisan! ⚡
                        </p>
                    </div>

                    {/* Products Grid */}
                    <section className="products-section">
                        <div className="product-grid">
                            {flashSaleProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    showDiscount
                                    showBadge="flash"
                                />
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

        .page-header {
          margin-bottom: var(--space-6);
          padding: var(--space-6);
          background: linear-gradient(135deg, #FEF3C7, #FDE68A);
          border-radius: var(--radius-xl);
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .header-title h1 {
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--gray-900);
        }

        .header-title :global(.flash-icon) {
          color: var(--accent-yellow);
        }

        .timer-box {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: rgba(0,0,0,0.1);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--gray-700);
        }

        .header-desc {
          font-size: var(--text-sm);
          color: var(--gray-600);
        }

        .products-section {
          background: var(--bg-primary);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
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
