'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts, mockCategories } from '@/lib/mockData'

export default function CategoryPage() {
    const params = useParams()
    const slug = params.id as string
    const [sortBy, setSortBy] = useState('newest')

    // Find category
    const category = mockCategories.find(c => c.slug === slug)
    const categoryName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')
    const categoryIcon = category?.icon || '📦'

    // Get products (in real app, filter by category)
    const products = mockProducts.slice(0, 12)

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <Link href="/categories" className="back-link">
                            <ArrowLeft size={20} />
                            <span>Semua Kategori</span>
                        </Link>
                    </div>

                    {/* Page Header */}
                    <div className="page-header">
                        <span className="category-icon">{categoryIcon}</span>
                        <h1>{categoryName}</h1>
                        <p>{products.length} produk ditemukan</p>
                    </div>

                    {/* Filter Bar */}
                    <div className="filter-bar">
                        <button className="filter-btn">
                            <SlidersHorizontal size={16} />
                            <span>Filter</span>
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="cheapest">Termurah</option>
                            <option value="expensive">Termahal</option>
                            <option value="bestseller">Terlaris</option>
                        </select>
                    </div>

                    {/* Products Grid */}
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="load-more">
                        <button className="btn btn-outline">Muat Lebih Banyak</button>
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
          text-align: center;
          margin-bottom: var(--space-6);
          padding: var(--space-6);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .category-icon {
          font-size: 48px;
          display: block;
          margin-bottom: var(--space-2);
        }

        .page-header h1 {
          font-size: var(--text-xl);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .page-header p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
        }

        .sort-select {
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-primary);
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

        .load-more {
          display: flex;
          justify-content: center;
          margin-top: var(--space-6);
        }
      `}</style>
        </>
    )
}
