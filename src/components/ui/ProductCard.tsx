'use client'

import Link from 'next/link'
import { Heart, Star, MapPin } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, calculateDiscount } from '@/lib/mockData'

interface ProductCardProps {
    product: Product
    showStore?: boolean
}

export default function ProductCard({ product, showStore = true }: ProductCardProps) {
    const hasDiscount = product.discount_price !== null

    return (
        <div className="product-card">
            <Link href={`/products/${product.id}`} className="product-link">
                {/* Image */}
                <div className="product-card-image">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                    />

                    {hasDiscount && (
                        <span className="product-card-badge badge-discount">
                            -{calculateDiscount(product.price, product.discount_price!)}%
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    className="product-card-wishlist"
                    onClick={(e) => {
                        e.preventDefault()
                        // TODO: Add to wishlist
                    }}
                >
                    <Heart size={18} />
                </button>

                {/* Content */}
                <div className="product-card-content">
                    {showStore && product.store && (
                        <div className="product-card-store">
                            <span className="store-name">{product.store.name}</span>
                            {product.store.is_verified && <span className="verified-badge">✓</span>}
                        </div>
                    )}

                    <h3 className="product-card-title">{product.name}</h3>

                    <div className="product-card-price">
                        <span className="price">
                            {formatPrice(product.discount_price || product.price)}
                        </span>
                        {hasDiscount && (
                            <span className="price-original">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    <div className="product-card-meta">
                        <div className="rating">
                            <Star size={12} className="rating-star" fill="currentColor" />
                            <span>{product.rating}</span>
                            <span className="meta-divider">|</span>
                            <span>Terjual {product.total_sold > 1000 ? `${(product.total_sold / 1000).toFixed(1)}rb` : product.total_sold}</span>
                        </div>
                        {product.store?.distance && (
                            <div className="location">
                                <MapPin size={12} />
                                <span>{product.store.distance} km</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            <style jsx>{`
        .product-card {
          position: relative;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .product-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .product-card-image {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: var(--gray-100);
        }

        .product-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .product-card:hover .product-card-image img {
          transform: scale(1.1);
        }

        .product-card-badge {
          position: absolute;
          top: var(--space-2);
          left: var(--space-2);
          padding: var(--space-1) var(--space-2);
          font-size: 11px;
          font-weight: 700;
          border-radius: var(--radius-sm);
        }

        .badge-discount {
          background: linear-gradient(135deg, var(--accent-red) 0%, var(--accent-pink) 100%);
          color: white;
        }

        .product-card-wishlist {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          z-index: 10;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-md);
          color: var(--gray-400);
          transition: all var(--transition-fast);
          border: none;
          cursor: pointer;
        }

        .product-card-wishlist:hover {
          background: var(--primary-500);
          color: white;
        }

        .product-card-content {
          padding: var(--space-3);
        }

        .product-card-store {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          margin-bottom: var(--space-1);
        }

        .store-name {
          font-size: 11px;
          color: var(--text-tertiary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .verified-badge {
          font-size: 10px;
          color: var(--secondary-500);
          font-weight: 700;
        }

        .product-card-title {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: var(--space-2);
          line-height: 1.4;
        }

        .product-card-price {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
          flex-wrap: wrap;
        }

        .price {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--primary-600);
        }

        .price-original {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-decoration: line-through;
        }

        .product-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-tertiary);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .rating-star {
          color: var(--accent-yellow);
        }

        .meta-divider {
          color: var(--gray-300);
        }

        .location {
          display: flex;
          align-items: center;
          gap: 2px;
          color: var(--secondary-600);
        }
      `}</style>
        </div>
    )
}
