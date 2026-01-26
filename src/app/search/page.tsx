'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts } from '@/lib/mockData'

const popularSearches = ['Mie Ayam', 'Kopi', 'Kerupuk', 'Elektronik', 'Fashion']
const recentSearches = ['Pempek', 'Martabak', 'Smartphone']

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState(mockProducts)

  useEffect(() => {
    if (searchQuery) {
      const filtered = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [searchQuery])

  return (
    <main className="main-content">
      <div className="container">
        {/* Search Bar */}
        <div className="search-bar">
          <Link href="/" className="back-btn">
            <ArrowLeft size={20} />
          </Link>
          <div className="search-input-wrapper">
            <SearchIcon size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')} aria-label="Bersihkan pencarian">
                <X size={18} />
              </button>
            )}
          </div>
          <button className="filter-btn" aria-label="Filter pencarian">
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* No Query State */}
        {!searchQuery && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="search-section">
                <div className="section-header">
                  <h2>Pencarian Terakhir</h2>
                  <button className="clear-all">Hapus</button>
                </div>
                <div className="search-chips">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      className="search-chip"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="search-section">
              <h2>Pencarian Populer</h2>
              <div className="search-chips">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    className="search-chip popular"
                    onClick={() => setSearchQuery(term)}
                  >
                    🔥 {term}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Results */}
        {searchQuery && (
          <div className="results-section">
            <p className="results-count">
              {results.length} hasil untuk &quot;{searchQuery}&quot;
            </p>
            {results.length > 0 ? (
              <div className="product-grid">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <SearchIcon size={64} />
                <h2>Produk Tidak Ditemukan</h2>
                <p>Coba kata kunci lain atau jelajahi kategori</p>
                <Link href="/categories" className="btn btn-primary">
                  Lihat Kategori
                </Link>
              </div>
            )}
          </div>
        )}
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

        .search-bar {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .back-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-2) var(--space-3);
          border: 2px solid transparent;
        }

        .search-input-wrapper:focus-within {
          border-color: var(--primary-500);
        }

        .search-input-wrapper :global(.search-icon) {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .search-input-wrapper input {
          flex: 1;
          border: none;
          background: none;
          padding: var(--space-2);
          font-size: var(--text-sm);
          outline: none;
        }

        .clear-btn {
          padding: var(--space-1);
          color: var(--text-tertiary);
        }

        .filter-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
        }

        .search-section {
          margin-bottom: var(--space-6);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .search-section h2 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .clear-all {
          font-size: var(--text-xs);
          color: var(--primary-600);
        }

        .search-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .search-chip {
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .search-chip.popular {
          background: var(--primary-50);
          color: var(--primary-600);
        }

        .results-section {
          min-height: 300px;
        }

        .results-count {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
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

        .empty-state {
          text-align: center;
          padding: var(--space-12);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .empty-state :global(svg) {
          color: var(--gray-300);
          margin-bottom: var(--space-4);
        }

        .empty-state h2 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .empty-state p {
          color: var(--text-tertiary);
          margin-bottom: var(--space-6);
        }
      `}</style>
    </main>
  )
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
      <MobileNav />
    </>
  )
}
