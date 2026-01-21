'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, SlidersHorizontal, Grid3X3, List } from 'lucide-react'
import { useState, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts } from '@/lib/mockData'

function ProductsContent() {
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'newest'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState(sort)

  // Sort products
  let products = [...mockProducts]
  if (sortBy === 'bestseller') {
    products = products.sort((a, b) => (b.total_sold || 0) - (a.total_sold || 0))
  } else if (sortBy === 'cheapest') {
    products = products.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'expensive') {
    products = products.sort((a, b) => b.price - a.price)
  }

  const getTitle = () => {
    switch (sortBy) {
      case 'bestseller': return 'Produk Terlaris'
      case 'newest': return 'Produk Terbaru'
      case 'cheapest': return 'Harga Terendah'
      case 'expensive': return 'Harga Tertinggi'
      default: return 'Semua Produk'
    }
  }

  return (
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
          <h1>{getTitle()}</h1>
          <p>{products.length} produk tersedia</p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-left">
            <button className="filter-btn">
              <SlidersHorizontal size={16} />
              <span>Filter</span>
            </button>
          </div>
          <div className="filter-right">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Terbaru</option>
              <option value="bestseller">Terlaris</option>
              <option value="cheapest">Termurah</option>
              <option value="expensive">Termahal</option>
            </select>
            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`product-grid ${viewMode}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="load-more">
          <button className="btn btn-outline">Muat Lebih Banyak</button>
        </div>
      </div>
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
          padding: var(--space-3);
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
        }

        .filter-left,
        .filter-right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--gray-100);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .sort-select {
          padding: var(--space-2) var(--space-3);
          background: var(--gray-100);
          border: none;
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-primary);
        }

        .view-toggle {
          display: flex;
          background: var(--gray-100);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .view-toggle button {
          padding: var(--space-2);
          color: var(--text-tertiary);
        }

        .view-toggle button.active {
          background: var(--primary-500);
          color: white;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        .product-grid.list {
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .product-grid.grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) {
          .product-grid.grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .product-grid.grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .load-more {
          display: flex;
          justify-content: center;
          margin-top: var(--space-6);
        }
      `}</style>
    </main>
  )
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsContent />
      </Suspense>
      <Footer />
      <MobileNav />
    </>
  )
}
