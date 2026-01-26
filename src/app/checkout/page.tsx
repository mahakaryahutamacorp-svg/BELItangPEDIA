'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  MapPin,
  Truck,
  Store,
  CreditCard,
  CheckCircle,
  ChevronDown
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, getStoreById, shippingOptions } from '@/lib/mockData'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [selectedShipping, setSelectedShipping] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const storeIds = Object.keys(items)
  const isEmpty = storeIds.length === 0

  // Calculate shipping total
  const getShippingTotal = () => {
    return storeIds.reduce((total, storeId) => {
      const shippingId = selectedShipping[storeId] || 'local-sameday'
      const option = shippingOptions.find(o => o.id === shippingId)
      return total + (option?.price || 0)
    }, 0)
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setOrderSuccess(true)
    clearCart()
    setIsSubmitting(false)
  }

  if (orderSuccess) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="container">
            <div className="order-success">
              <CheckCircle size={80} className="success-icon" />
              <h1>Pesanan Berhasil!</h1>
              <p>Terima kasih telah berbelanja di BELItangPEDIA</p>
              <p className="order-info">
                Pesanan Anda akan segera diproses. Pembayaran dilakukan secara <strong>COD (Bayar di Tempat)</strong> saat barang diterima.
              </p>
              <div className="success-actions">
                <Link href="/orders" className="btn btn-primary">
                  Lihat Pesanan Saya
                </Link>
                <Link href="/" className="btn btn-secondary">
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
        <style jsx>{`
          .checkout-page {
            min-height: 100vh;
            background: var(--bg-secondary);
            padding: var(--space-8) 0;
          }
          .order-success {
            max-width: 500px;
            margin: 0 auto;
            text-align: center;
            padding: var(--space-8);
            background: var(--bg-primary);
            border-radius: var(--radius-2xl);
          }
          .success-icon {
            color: var(--secondary-500);
            margin-bottom: var(--space-4);
          }
          .order-success h1 {
            font-size: var(--text-2xl);
            margin-bottom: var(--space-2);
          }
          .order-success p {
            color: var(--text-secondary);
            margin-bottom: var(--space-2);
          }
          .order-info {
            background: var(--secondary-50);
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            margin: var(--space-4) 0;
          }
          .success-actions {
            display: flex;
            flex-direction: column;
            gap: var(--space-3);
            margin-top: var(--space-6);
          }
        `}</style>
      </>
    )
  }

  if (isEmpty) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="container">
            <div className="empty-cart">
              <p>Keranjang Anda kosong</p>
              <Link href="/products" className="btn btn-primary">
                Mulai Belanja
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="checkout-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <div className="container">
            <Link href="/">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/cart">Keranjang</Link>
            <ChevronRight size={14} />
            <span>Checkout</span>
          </div>
        </div>

        <div className="container">
          <h1 className="page-title">Checkout</h1>

          <div className="checkout-layout">
            {/* Main Content */}
            <div className="checkout-main">
              {/* Shipping Address */}
              <section className="checkout-section">
                <h2>
                  <MapPin size={20} />
                  Alamat Pengiriman
                </h2>
                <div className="address-card">
                  <div className="address-info">
                    <strong>Rumah</strong>
                    <p>Ahmad Fauzi | +62 812-3456-7890</p>
                    <p>Jl. Merdeka No. 123, RT 01/RW 02</p>
                    <p>Belitang, OKU Timur, Sumatera Selatan, 32382</p>
                  </div>
                  <button className="btn-change">Ubah</button>
                </div>
              </section>

              {/* Order Items by Store */}
              {storeIds.map((storeId) => {
                const store = getStoreById(storeId)
                const storeItems = items[storeId]
                const currentShipping = selectedShipping[storeId] || 'local-sameday'
                const shippingOption = shippingOptions.find(o => o.id === currentShipping)

                return (
                  <section key={storeId} className="checkout-section store-section">
                    <div className="store-header">
                      <Store size={18} />
                      <span className="store-name">{store?.name || 'Toko'}</span>
                      {store?.is_verified && <span className="verified">✓</span>}
                    </div>

                    {/* Items */}
                    <div className="order-items">
                      {storeItems.map((item) => (
                        <div key={`${item.product.id}-${JSON.stringify(item.selectedVariant)}`} className="order-item">
                          <img src={item.product.images[0]} alt={item.product.name} />
                          <div className="item-info">
                            <span className="item-name">{item.product.name}</span>
                            {item.selectedVariant && (
                              <span className="item-variant">
                                {Object.values(item.selectedVariant).join(', ')}
                              </span>
                            )}
                            <span className="item-qty">{item.quantity}x {formatPrice(item.product.discount_price || item.product.price)}</span>
                          </div>
                          <span className="item-total">
                            {formatPrice((item.product.discount_price || item.product.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Selection */}
                    <div className="shipping-selection">
                      <h3>
                        <Truck size={16} />
                        Pilih Pengiriman
                      </h3>
                      <div className="shipping-options">
                        {shippingOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`shipping-option ${currentShipping === option.id ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`shipping-${storeId}`}
                              value={option.id}
                              checked={currentShipping === option.id}
                              onChange={() => setSelectedShipping((prev: Record<string, string>) => ({
                                ...prev,
                                [storeId]: option.id
                              }))}
                            />
                            <span className="shipping-icon">{option.icon}</span>
                            <div className="shipping-info">
                              <strong>{option.name}</strong>
                              <span>{option.estimated_days}</span>
                            </div>
                            <span className="shipping-price">
                              {option.price === 0 ? 'Gratis' : formatPrice(option.price)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </section>
                )
              })}

              {/* Payment Method */}
              <section className="checkout-section">
                <h2>
                  <CreditCard size={20} />
                  Metode Pembayaran
                </h2>
                <div className="payment-option selected">
                  <span className="payment-icon">💵</span>
                  <div className="payment-info">
                    <strong>COD - Bayar di Tempat</strong>
                    <span>Bayar tunai saat barang diterima</span>
                  </div>
                  <CheckCircle size={20} className="check-icon" />
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <div className="checkout-summary">
              <div className="summary-card">
                <h2>Ringkasan Pesanan</h2>

                <div className="summary-row">
                  <span>Subtotal Produk</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                <div className="summary-row">
                  <span>Total Ongkos Kirim</span>
                  <span>{formatPrice(getShippingTotal())}</span>
                </div>

                <div className="divider"></div>

                <div className="summary-row total">
                  <span>Total Pembayaran</span>
                  <span>{formatPrice(getTotalPrice() + getShippingTotal())}</span>
                </div>

                <button
                  className="btn btn-primary btn-lg place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                </button>

                <p className="terms-note">
                  Dengan menekan tombol &quot;Buat Pesanan&quot;, Anda menyetujui <Link href="/terms">Syarat &amp; Ketentuan</Link> kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: var(--bg-secondary);
          padding-bottom: 100px;
        }

        @media (min-width: 768px) {
          .checkout-page {
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
          font-size: var(--text-xl);
          font-weight: 700;
          padding: var(--space-6) 0;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }

        @media (min-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 1fr 380px;
          }
        }

        .checkout-section {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-4);
        }

        .checkout-section h2 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .address-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-4);
          background: var(--gray-50);
          border-radius: var(--radius-lg);
          border: 2px solid var(--primary-500);
        }

        .address-info strong {
          display: block;
          margin-bottom: var(--space-1);
        }

        .address-info p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-1);
        }

        .btn-change {
          padding: var(--space-2) var(--space-4);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          color: var(--primary-600);
          cursor: pointer;
        }

        /* Store Section */
        .store-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-light);
          margin-bottom: var(--space-4);
        }

        .store-name {
          font-weight: 600;
        }

        .verified {
          color: var(--secondary-500);
        }

        .order-items {
          margin-bottom: var(--space-4);
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--border-light);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-item img {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .item-variant {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .item-qty {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .item-total {
          font-weight: 600;
        }

        /* Shipping Selection */
        .shipping-selection h3 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-3);
        }

        .shipping-options {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .shipping-option {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--gray-50);
          border-radius: var(--radius-md);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .shipping-option:hover {
          border-color: var(--primary-300);
        }

        .shipping-option.selected {
          border-color: var(--primary-500);
          background: var(--primary-50);
        }

        .shipping-option input {
          display: none;
        }

        .shipping-icon {
          font-size: 20px;
        }

        .shipping-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .shipping-info strong {
          font-size: var(--text-sm);
        }

        .shipping-info span {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .shipping-price {
          font-weight: 600;
          color: var(--secondary-600);
        }

        /* Payment Option */
        .payment-option {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--secondary-50);
          border-radius: var(--radius-lg);
          border: 2px solid var(--secondary-500);
        }

        .payment-icon {
          font-size: 24px;
        }

        .payment-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .payment-info span {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .check-icon {
          color: var(--secondary-500);
        }

        /* Summary */
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
          padding: var(--space-2) 0;
          font-size: var(--text-sm);
        }

        .divider {
          height: 1px;
          background: var(--border-light);
          margin: var(--space-4) 0;
        }

        .summary-row.total {
          font-weight: 700;
          font-size: var(--text-lg);
          color: var(--primary-600);
        }

        .place-order-btn {
          width: 100%;
          margin-top: var(--space-4);
        }

        .place-order-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .terms-note {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-align: center;
          margin-top: var(--space-3);
        }

        .terms-note a {
          color: var(--primary-600);
        }

        .empty-cart {
          text-align: center;
          padding: var(--space-16);
        }
      `}</style>
    </>
  )
}
