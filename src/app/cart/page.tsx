'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Store,
  Truck
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, getStoreById } from '@/lib/mockData'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartStore()

  const storeIds = Object.keys(items)
  const isEmpty = storeIds.length === 0

  return (
    <>
      <Header />

      <main className="cart-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <div className="container">
            <Link href="/">Beranda</Link>
            <ChevronRight size={14} />
            <span>Keranjang Belanja</span>
          </div>
        </div>

        <div className="container">
          <h1 className="page-title">
            <ShoppingCart size={28} />
            Keranjang Belanja
          </h1>

          {isEmpty ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h2>Keranjang Kosong</h2>
              <p>Yuk, mulai belanja dan isi keranjangmu!</p>
              <Link href="/products" className="btn btn-primary">
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-items">
                {storeIds.map((storeId) => {
                  const store = getStoreById(storeId)
                  const storeItems = items[storeId]

                  return (
                    <div key={storeId} className="store-group">
                      <div className="store-header">
                        <div className="store-info">
                          <Store size={18} />
                          <span className="store-name">{store?.name || 'Toko'}</span>
                          {store?.is_verified && <span className="verified">✓</span>}
                        </div>
                      </div>

                      <div className="items-list">
                        {storeItems.map((item) => {
                          const price = item.product.discount_price || item.product.price

                          return (
                            <div key={`${item.product.id}-${JSON.stringify(item.selectedVariant)}`} className="cart-item">
                              <div className="item-image">
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  width={80}
                                  height={80}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>

                              <div className="item-details">
                                <Link href={`/products/${item.product.id}`} className="item-name">
                                  {item.product.name}
                                </Link>
                                {item.selectedVariant && (
                                  <div className="item-variant">
                                    {Object.entries(item.selectedVariant).map(([key, value]) => (
                                      <span key={key}>{key}: {value}</span>
                                    ))}
                                  </div>
                                )}
                                <div className="item-price">
                                  {formatPrice(price)}
                                  {item.product.discount_price && (
                                    <span className="original-price">
                                      {formatPrice(item.product.price)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="item-actions">
                                <div className="quantity-control">
                                  <button
                                    onClick={() => updateQuantity(
                                      storeId,
                                      item.product.id,
                                      item.quantity - 1,
                                      item.selectedVariant
                                    )}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(
                                      storeId,
                                      item.product.id,
                                      item.quantity + 1,
                                      item.selectedVariant
                                    )}
                                    disabled={item.quantity >= item.product.stock}
                                    aria-label="Tambah jumlah"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <button
                                  className="delete-btn"
                                  onClick={() => removeFromCart(storeId, item.product.id, item.selectedVariant)}
                                  aria-label="Hapus item"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>

                              <div className="item-subtotal">
                                {formatPrice(price * item.quantity)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-card">
                  <h2>Ringkasan Pesanan</h2>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>

                  <div className="summary-row shipping">
                    <span>
                      <Truck size={16} />
                      Ongkos Kirim
                    </span>
                    <span className="shipping-note">Dihitung saat checkout</span>
                  </div>

                  <div className="divider"></div>

                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>

                  <Link href="/checkout" className="btn btn-primary btn-lg checkout-btn">
                    Checkout ({storeIds.reduce((acc, storeId) => acc + items[storeId].reduce((sum, item) => sum + item.quantity, 0), 0)} item)
                  </Link>

                  <div className="payment-info">
                    <span className="cod-badge">💵 COD</span>
                    <p>Bayar di tempat setelah barang diterima</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          background: var(--bg-secondary);
          padding-bottom: 100px;
        }

        @media (min-width: 768px) {
          .cart-page {
            padding-bottom: 0;
          }
        }

        .breadcrumb {
          padding: var(--space-3) 0;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
        }

        .breadcrumb .container {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .breadcrumb a {
          color: var(--text-secondary);
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-xl);
          font-weight: 700;
          padding: var(--space-6) 0;
          color: var(--text-primary);
        }

        /* Empty Cart */
        .empty-cart {
          text-align: center;
          padding: var(--space-16) var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: var(--space-4);
        }

        .empty-cart h2 {
          font-size: var(--text-xl);
          margin-bottom: var(--space-2);
        }

        .empty-cart p {
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        /* Cart Layout */
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }

        @media (min-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr 380px;
          }
        }

        /* Store Groups */
        .store-group {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }

        .store-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          background: var(--gray-50);
          border-bottom: 1px solid var(--border-light);
        }

        .store-info {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .store-name {
          font-weight: 600;
        }

        .verified {
          color: var(--secondary-500);
          font-size: var(--text-xs);
        }

        /* Cart Items */
        .items-list {
          padding: var(--space-4);
        }

        .cart-item {
          display: grid;
          grid-template-columns: 80px 1fr auto auto;
          gap: var(--space-4);
          align-items: start;
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--border-light);
        }

        .cart-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        @media (max-width: 640px) {
          .cart-item {
            grid-template-columns: 80px 1fr;
            grid-template-rows: auto auto;
          }
        }

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--gray-100);
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          min-width: 0;
        }

        .item-name {
          font-weight: 500;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: var(--space-1);
        }

        .item-name:hover {
          color: var(--primary-600);
        }

        .item-variant {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-bottom: var(--space-2);
        }

        .item-variant span {
          margin-right: var(--space-2);
        }

        .item-price {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 600;
          color: var(--primary-600);
        }

        .original-price {
          font-size: var(--text-sm);
          font-weight: 400;
          color: var(--text-tertiary);
          text-decoration: line-through;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        @media (max-width: 640px) {
          .item-actions {
            grid-column: 1 / -1;
            justify-content: space-between;
          }
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
        }

        .quantity-control button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .quantity-control button:disabled {
          opacity: 0.3;
        }

        .quantity-control span {
          min-width: 36px;
          text-align: center;
          font-weight: 600;
        }

        .delete-btn {
          color: var(--text-tertiary);
          transition: color var(--transition-fast);
        }

        .delete-btn:hover {
          color: var(--accent-red);
        }

        .item-subtotal {
          font-weight: 700;
          color: var(--text-primary);
          text-align: right;
          min-width: 100px;
        }

        @media (max-width: 640px) {
          .item-subtotal {
            grid-column: 1 / -1;
            text-align: left;
            padding-top: var(--space-2);
          }
        }

        /* Order Summary */
        .summary-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          position: sticky;
          top: 100px;
        }

        .summary-card h2 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) 0;
          font-size: var(--text-sm);
        }

        .summary-row.shipping span {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .shipping-note {
          color: var(--text-tertiary);
          font-size: var(--text-xs);
        }

        .divider {
          height: 1px;
          background: var(--border-light);
          margin: var(--space-4) 0;
        }

        .summary-row.total {
          font-weight: 700;
          font-size: var(--text-lg);
          color: var(--text-primary);
        }

        .checkout-btn {
          width: 100%;
          margin-top: var(--space-4);
        }

        .payment-info {
          margin-top: var(--space-4);
          padding: var(--space-4);
          background: var(--secondary-50);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .cod-badge {
          display: inline-block;
          padding: var(--space-1) var(--space-3);
          background: var(--secondary-500);
          color: white;
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .payment-info p {
          font-size: var(--text-sm);
          color: var(--secondary-700);
        }
      `}</style>
    </>
  )
}
