'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  MapPin,
  Truck,
  Store,
  ChevronRight
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { useCartStore } from '@/store/cartStore'
import {
  getProductById,
  formatPrice,
  calculateDiscount,
  mockProducts,
  shippingOptions
} from '@/lib/mockData'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const product = getProductById(productId) || mockProducts[0]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const addToCart = useCartStore((state) => state.addToCart)

  const hasDiscount = product.discount_price !== null
  const relatedProducts = mockProducts.filter(p => p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : null)
    // Show toast or feedback
    alert('Produk ditambahkan ke keranjang!')
  }

  const handleBuyNow = () => {
    addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : null)
    window.location.href = '/cart'
  }

  return (
    <>
      <Header />

      <main className="product-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <div className="container">
            <Link href="/">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/products">Produk</Link>
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </div>
        </div>

        <div className="container">
          <div className="product-layout">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="main-image" style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                {hasDiscount && (
                  <span className="discount-badge">
                    -{calculateDiscount(product.price, product.discount_price!)}%
                  </span>
                )}
              </div>
              <div className="thumbnail-list">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Lihat gambar ${index + 1}`}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              <div className="product-meta">
                <div className="rating">
                  <Star size={16} fill="currentColor" className="star" />
                  <span className="rating-value">{product.rating}</span>
                  <span className="rating-count">({product.total_reviews} ulasan)</span>
                </div>
                <span className="divider">•</span>
                <span className="sold">Terjual {product.total_sold}+</span>
              </div>

              <div className="product-price">
                <span className="current-price">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="original-price">{formatPrice(product.price)}</span>
                    <span className="discount-percent">
                      -{calculateDiscount(product.price, product.discount_price!)}%
                    </span>
                  </>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.map((variant) => (
                <div key={variant.id} className="variant-section">
                  <h4>{variant.name}: <span>{selectedVariants[variant.name] || 'Pilih'}</span></h4>
                  <div className="variant-options">
                    {variant.options.map((option) => (
                      <button
                        key={option.id}
                        className={`variant-btn ${selectedVariants[variant.name] === option.value ? 'active' : ''}`}
                        onClick={() => setSelectedVariants(prev => ({
                          ...prev,
                          [variant.name]: option.value
                        }))}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="quantity-section">
                <h4>Jumlah</h4>
                <div className="quantity-control">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="stock-info">Stok: {product.stock}</span>
              </div>

              {/* Shipping */}
              <div className="shipping-section">
                <h4>Pengiriman</h4>
                <div className="shipping-location">
                  <MapPin size={16} />
                  <span>Dikirim dari <strong>Belitang, OKU Timur</strong></span>
                </div>
                <div className="shipping-options">
                  {shippingOptions.map((option) => (
                    <div key={option.id} className="shipping-option">
                      <span className="shipping-icon">{option.icon}</span>
                      <div className="shipping-info">
                        <strong>{option.name}</strong>
                        <span>{option.estimated_days}</span>
                      </div>
                      <span className="shipping-price">
                        {option.price === 0 ? 'Gratis' : formatPrice(option.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="product-actions">
                <button className="btn-chat">
                  <MessageCircle size={20} />
                  Chat
                </button>
                <button className="btn-wishlist">
                  <Heart size={20} />
                </button>
                <button className="btn-cart" onClick={handleAddToCart}>
                  <ShoppingCart size={20} />
                  Keranjang
                </button>
                <button className="btn-buy" onClick={handleBuyNow}>
                  Beli Sekarang
                </button>
              </div>
            </div>

            {/* Store Card */}
            <div className="store-card">
              {product.store && (
                <Link href={`/store/${product.store.id}`} className="store-link">
                  <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0 }}>
                    <Image
                      src={product.store.logo_url || ''}
                      alt={product.store.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="store-info">
                    <h3>
                      {product.store.name}
                      {product.store.is_verified && <span className="verified">✓</span>}
                    </h3>
                    <p>
                      <Star size={12} fill="currentColor" className="star" />
                      {product.store.rating} • {product.store.distance} km
                    </p>
                  </div>
                  <button className="btn-visit">
                    <Store size={16} />
                    Kunjungi
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="product-description">
            <h2>Deskripsi Produk</h2>
            <p>{product.description}</p>
          </div>

          {/* Reviews */}
          <div className="product-reviews">
            <div className="reviews-header">
              <h2>Ulasan Pembeli</h2>
              <div className="reviews-summary">
                <div className="rating-big">
                  <Star size={24} fill="currentColor" className="star" />
                  <span className="rating-value">{product.rating}</span>
                  <span className="rating-max">/5.0</span>
                </div>
                <span className="total-reviews">{product.total_reviews} ulasan</span>
              </div>
            </div>
            <div className="reviews-empty">
              <p>Belum ada ulasan untuk produk ini.</p>
            </div>
          </div>

          {/* Related Products */}
          <div className="related-products">
            <h2>Produk Serupa</h2>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />

      <style jsx>{`
        .product-detail-page {
          min-height: 100vh;
          background: var(--bg-secondary);
          padding-bottom: 100px;
        }

        @media (min-width: 768px) {
          .product-detail-page {
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

        .breadcrumb a:hover {
          color: var(--primary-600);
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          padding: var(--space-6) 0;
        }

        @media (min-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .product-layout {
            grid-template-columns: 400px 1fr 300px;
          }
        }

        /* Gallery */
        .product-gallery {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
        }

        .main-image {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--gray-100);
          margin-bottom: var(--space-3);
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .discount-badge {
          position: absolute;
          top: var(--space-3);
          left: var(--space-3);
          padding: var(--space-1) var(--space-3);
          background: linear-gradient(135deg, var(--accent-red), var(--accent-pink));
          color: white;
          font-size: var(--text-sm);
          font-weight: 700;
          border-radius: var(--radius-md);
        }

        .thumbnail-list {
          display: flex;
          gap: var(--space-2);
          overflow-x: auto;
        }

        .thumbnail {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
        }

        .thumbnail.active {
          border-color: var(--primary-500);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Product Info */
        .product-info {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
        }

        .product-title {
          font-size: var(--text-xl);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-3);
          line-height: 1.4;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .star {
          color: var(--accent-yellow);
        }

        .rating-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .divider {
          color: var(--gray-300);
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--border-light);
        }

        .current-price {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--primary-600);
        }

        .original-price {
          font-size: var(--text-base);
          color: var(--text-tertiary);
          text-decoration: line-through;
        }

        .discount-percent {
          padding: var(--space-1) var(--space-2);
          background: var(--primary-100);
          color: var(--primary-700);
          font-size: var(--text-xs);
          font-weight: 700;
          border-radius: var(--radius-sm);
        }

        /* Variants */
        .variant-section {
          margin-bottom: var(--space-4);
        }

        .variant-section h4 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .variant-section h4 span {
          color: var(--primary-600);
        }

        .variant-options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .variant-btn {
          padding: var(--space-2) var(--space-4);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          background: var(--bg-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .variant-btn:hover {
          border-color: var(--primary-500);
        }

        .variant-btn.active {
          border-color: var(--primary-500);
          background: var(--primary-50);
          color: var(--primary-700);
        }

        /* Quantity */
        .quantity-section {
          margin-bottom: var(--space-4);
        }

        .quantity-section h4 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .quantity-control {
          display: inline-flex;
          align-items: center;
          border: 2px solid var(--border-light);
          border-radius: var(--radius-md);
        }

        .quantity-control button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .quantity-control button:disabled {
          opacity: 0.3;
        }

        .quantity-control span {
          min-width: 48px;
          text-align: center;
          font-weight: 600;
        }

        .stock-info {
          margin-left: var(--space-3);
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        /* Shipping */
        .shipping-section {
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--border-light);
        }

        .shipping-section h4 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-3);
        }

        .shipping-location {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
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
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--secondary-600);
        }

        /* Actions */
        .product-actions {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .btn-chat, .btn-wishlist {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-wishlist {
          padding: var(--space-3);
        }

        .btn-chat:hover, .btn-wishlist:hover {
          border-color: var(--primary-500);
          color: var(--primary-600);
        }

        .btn-cart {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border: 2px solid var(--primary-500);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          color: var(--primary-600);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-cart:hover {
          background: var(--primary-50);
        }

        .btn-buy {
          flex: 1;
          padding: var(--space-3) var(--space-4);
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          border-radius: var(--radius-lg);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-buy:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Store Card */
        .store-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
        }

        @media (max-width: 1023px) {
          .store-card {
            grid-column: 1 / -1;
          }
        }

        .store-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
        }

        .store-logo {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          object-fit: cover;
        }

        .store-info {
          flex: 1;
        }

        .store-info h3 {
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

        .store-info p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .btn-visit {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          border: 2px solid var(--secondary-500);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--secondary-600);
          font-size: var(--text-sm);
          font-weight: 600;
          cursor: pointer;
        }

        .btn-visit:hover {
          background: var(--secondary-50);
        }

        /* Description */
        .product-description {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .product-description h2 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .product-description p {
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* Reviews */
        .product-reviews {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .reviews-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }

        .reviews-header h2 {
          font-size: var(--text-lg);
          font-weight: 600;
        }

        .reviews-summary {
          text-align: right;
        }

        .rating-big {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--space-1);
        }

        .rating-big .rating-value {
          font-size: var(--text-2xl);
          font-weight: 700;
        }

        .rating-big .rating-max {
          color: var(--text-tertiary);
        }

        .total-reviews {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .reviews-empty {
          text-align: center;
          padding: var(--space-8);
          color: var(--text-tertiary);
        }

        /* Related Products */
        .related-products {
          margin-bottom: var(--space-8);
        }

        .related-products h2 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-4);
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
      `}</style>
    </>
  )
}
