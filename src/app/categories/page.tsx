'use client'

import Link from 'next/link'
import { ArrowLeft, Grid3X3 } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { mockCategories } from '@/lib/mockData'

export default function CategoriesPage() {
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
              <Grid3X3 size={32} />
            </div>
            <div className="header-text">
              <h1>Semua Kategori</h1>
              <p>Temukan produk sesuai kebutuhanmu</p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="categories-grid">
            {mockCategories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category.id}
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{Math.floor(Math.random() * 500) + 100} produk</p>
                </div>
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
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
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

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        @media (min-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-6);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          text-align: center;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .category-icon {
          font-size: 48px;
        }

        .category-info h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .category-info p {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }
      `}</style>
    </>
  )
}
