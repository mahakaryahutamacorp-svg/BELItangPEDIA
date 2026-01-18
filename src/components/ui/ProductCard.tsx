'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Star, MapPin, ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, calculateDiscount } from '@/lib/mockData'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
  showDiscount?: boolean
  showBadge?: 'bestseller' | 'new' | 'flash' | null
  animationDelay?: number
}

export default function ProductCard({
  product,
  showDiscount = false,
  showBadge = null,
  animationDelay = 0
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const addToCart = useCartStore(state => state.addToCart)

  const discount = product.discount_price
    ? calculateDiscount(product.price, product.discount_price)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)

    // Simulate adding to cart
    await new Promise(resolve => setTimeout(resolve, 300))

    addToCart(product, 1, null)

    setIsAdding(false)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <article
        className="product-card animate-fadeInUp"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        {/* Image Container */}
        <div className="product-image">
          <img
            src={product.images[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            loading="lazy"
          />

          {/* Badges */}
          <div className="product-badges">
            {discount > 0 && (
              <span className="badge badge-discount">-{discount}%</span>
            )}
            {showBadge === 'bestseller' && (
              <span className="badge badge-bestseller">Terlaris</span>
            )}
            {showBadge === 'new' && (
              <span className="badge badge-new">Baru</span>
            )}
            {showBadge === 'flash' && (
              <span className="badge badge-flash">⚡ Flash</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick Add Button */}
          <button
            className={`quick-add-btn ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <div className="product-price">
            <span className="price-current">
              {formatPrice(product.discount_price || product.price)}
            </span>
            {product.discount_price && (
              <span className="price-original">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="product-meta">
            <div className="product-rating">
              <Star size={12} fill="currentColor" />
              <span>{product.rating}</span>
              <span className="divider">|</span>
              <span className="sold">{product.total_sold} terjual</span>
            </div>
          </div>

          {product.store && (
            <div className="product-store">
              <MapPin size={12} />
              <span>{product.store.address?.split(',')[0] || 'Belitang'}</span>
            </div>
          )}
        </div>

        <style jsx>{`
                    .product-card {
                        background: var(--bg-primary);
                        border-radius: var(--radius-2xl);
                        overflow: hidden;
                        box-shadow: var(--shadow-card);
                        transition: all var(--transition-normal);
                        cursor: pointer;
                    }

                    .product-card:hover {
                        transform: translateY(-6px);
                        box-shadow: var(--shadow-card-hover);
                    }

                    .product-image {
                        position: relative;
                        aspect-ratio: 1;
                        overflow: hidden;
                        background: var(--gray-100);
                    }

                    .product-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform var(--transition-slow);
                    }

                    .product-card:hover .product-image img {
                        transform: scale(1.08);
                    }

                    .product-badges {
                        position: absolute;
                        top: var(--space-2);
                        left: var(--space-2);
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-1);
                    }

                    .wishlist-btn {
                        position: absolute;
                        top: var(--space-2);
                        right: var(--space-2);
                        width: 36px;
                        height: 36px;
                        background: white;
                        border-radius: var(--radius-full);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--text-tertiary);
                        box-shadow: var(--shadow-md);
                        transition: all var(--transition-fast);
                        opacity: 0;
                        transform: scale(0.8);
                    }

                    .product-card:hover .wishlist-btn {
                        opacity: 1;
                        transform: scale(1);
                    }

                    .wishlist-btn:hover,
                    .wishlist-btn.active {
                        color: var(--accent-red);
                        transform: scale(1.1);
                    }

                    .quick-add-btn {
                        position: absolute;
                        bottom: var(--space-2);
                        right: var(--space-2);
                        width: 40px;
                        height: 40px;
                        background: var(--bg-gradient);
                        border-radius: var(--radius-xl);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
                        transition: all var(--transition-fast);
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    .product-card:hover .quick-add-btn {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .quick-add-btn:hover {
                        transform: scale(1.1);
                    }

                    .quick-add-btn.adding {
                        animation: pulse 0.3s ease;
                    }

                    .product-info {
                        padding: var(--space-3);
                    }

                    .product-name {
                        font-size: var(--text-sm);
                        font-weight: 500;
                        color: var(--text-primary);
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        line-height: 1.4;
                        min-height: 2.8em;
                        margin-bottom: var(--space-2);
                    }

                    .product-price {
                        display: flex;
                        align-items: baseline;
                        gap: var(--space-2);
                        flex-wrap: wrap;
                        margin-bottom: var(--space-2);
                    }

                    .price-current {
                        font-family: var(--font-display);
                        font-size: var(--text-base);
                        font-weight: 700;
                        color: var(--primary-600);
                    }

                    .price-original {
                        font-size: var(--text-xs);
                        color: var(--text-tertiary);
                        text-decoration: line-through;
                    }

                    .product-meta {
                        display: flex;
                        align-items: center;
                        gap: var(--space-2);
                        margin-bottom: var(--space-2);
                    }

                    .product-rating {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        font-size: var(--text-xs);
                        color: var(--text-secondary);
                    }

                    .product-rating svg {
                        color: var(--accent-yellow);
                    }

                    .product-rating .divider {
                        color: var(--gray-300);
                    }

                    .product-rating .sold {
                        color: var(--text-tertiary);
                    }

                    .product-store {
                        display: flex;
                        align-items: center;
                        gap: var(--space-1);
                        font-size: var(--text-xs);
                        color: var(--text-tertiary);
                    }

                    @media (max-width: 640px) {
                        .product-info {
                            padding: var(--space-2);
                        }
                        .product-name {
                            font-size: var(--text-xs);
                        }
                        .price-current {
                            font-size: var(--text-sm);
                        }
                        .wishlist-btn,
                        .quick-add-btn {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                `}</style>
      </article>
    </Link>
  )
}
