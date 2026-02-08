'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { mockProducts } from '@/lib/mockData'
import { useCartStore } from '@/store/cartStore'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockProducts.slice(0, 4))
  const addToCart = useCartStore(state => state.addToCart)

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    addToCart(product, 1)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

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
              <Heart size={32} fill="currentColor" />
            </div>
            <div className="header-text">
              <h1>Wishlist Saya</h1>
              <p>{wishlistItems.length} produk tersimpan</p>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
            <div className="wishlist-list">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                      <Image
                        src={item.images[0] || ''}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-price">{formatPrice(item.discount_price || item.price)}</p>
                    {item.discount_price && item.discount_price < item.price && (
                      <p className="item-original">
                        {formatPrice(item.price)}
                      </p>
                    )}
                  </div>
                  <div className="item-actions">
                    <button
                      className="cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart size={18} />
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={64} />
              <h2>Wishlist Kosong</h2>
              <p>Simpan produk favoritmu untuk dibeli nanti</p>
              <Link href="/products" className="btn btn-primary">
                Jelajahi Produk
              </Link>
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
          background: linear-gradient(135deg, #EC4899, #DB2777);
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

        .wishlist-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .wishlist-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-info {
          flex: 1;
          min-width: 0;
        }

        .item-info h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-price {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--primary-600);
        }

        .item-original {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-decoration: line-through;
        }

        .item-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .cart-btn {
          padding: var(--space-2);
          background: var(--primary-500);
          color: white;
          border-radius: var(--radius-lg);
        }

        .remove-btn {
          padding: var(--space-2);
          background: var(--gray-100);
          color: var(--text-tertiary);
          border-radius: var(--radius-lg);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-12);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .empty-state svg {
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
    </>
  )
}
