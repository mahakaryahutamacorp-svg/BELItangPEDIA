'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  Bell,
  Heart,
  ChevronDown,
  Store
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartItemCount = useCartStore((state) => state.getTotalItems())
  const { user, isAuthenticated } = useAuthStore()

  return (
    <header className="header">
      {/* Top Bar - Location */}
      <div className="header-top">
        <div className="container">
          <div className="header-location">
            <MapPin size={14} />
            <span>Dikirim ke <strong>Belitang, OKU Timur</strong></span>
            <ChevronDown size={14} />
          </div>
          <div className="header-top-links">
            <Link href="/seller">Mulai Berjualan</Link>
            <Link href="/help">Bantuan</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">
              <span className="logo-beli">BELI</span>
              <span className="logo-tang">tang</span>
              <span className="logo-pedia">PEDIA</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="header-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Cari produk, toko, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Cari</button>
          </div>

          {/* Actions */}
          <div className="header-actions">
            <Link href="/wishlist" className="header-action-btn">
              <Heart size={24} />
            </Link>

            <Link href="/notifications" className="header-action-btn">
              <Bell size={24} />
              <span className="action-badge">3</span>
            </Link>

            <Link href="/cart" className="header-action-btn cart-btn">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="action-badge">{cartItemCount}</span>
              )}
            </Link>

            <div className="header-divider"></div>

            {isAuthenticated ? (
              <Link href="/profile" className="header-user">
                <div className="user-avatar">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span className="user-name">{user?.full_name || 'User'}</span>
              </Link>
            ) : (
              <div className="header-auth">
                <Link href="/auth/login" className="btn btn-ghost btn-sm">Masuk</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">Daftar</Link>
              </div>
            )}

            <button
              className="header-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="header-nav">
        <div className="container">
          <ul className="nav-list">
            <li><Link href="/category/makanan">🍜 Makanan</Link></li>
            <li><Link href="/category/minuman">🧃 Minuman</Link></li>
            <li><Link href="/category/elektronik">📱 Elektronik</Link></li>
            <li><Link href="/category/fashion">👕 Fashion</Link></li>
            <li><Link href="/category/kesehatan">💊 Kesehatan</Link></li>
            <li><Link href="/category/kecantikan">💄 Kecantikan</Link></li>
            <li><Link href="/category/rumah-tangga">🏠 Rumah Tangga</Link></li>
            <li><Link href="/flash-sale" className="nav-flash-sale">⚡ Flash Sale</Link></li>
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          background: var(--bg-primary);
          box-shadow: var(--shadow-md);
        }

        .header-top {
          background: var(--gray-100);
          padding: var(--space-2) 0;
          font-size: var(--text-xs);
          display: none;
        }

        @media (min-width: 768px) {
          .header-top {
            display: block;
          }
        }

        .header-top .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-location {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .header-location:hover {
          color: var(--primary-600);
        }

        .header-top-links {
          display: flex;
          gap: var(--space-4);
        }

        .header-top-links a {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .header-top-links a:hover {
          color: var(--primary-600);
        }

        .header-main {
          padding: var(--space-3) 0;
        }

        .header-main .container {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-icon {
          font-size: 32px;
        }

        .logo-text {
          display: none;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: var(--text-xl);
        }

        @media (min-width: 768px) {
          .logo-text {
            display: block;
          }
        }

        .logo-beli {
          color: var(--primary-600);
        }

        .logo-tang {
          color: var(--gray-600);
          font-weight: 400;
        }

        .logo-pedia {
          color: var(--secondary-600);
        }

        .header-search {
          flex: 1;
          max-width: 600px;
          display: flex;
          align-items: center;
          background: var(--gray-100);
          border-radius: var(--radius-lg);
          padding: var(--space-2) var(--space-3);
          border: 2px solid transparent;
          transition: all var(--transition-fast);
        }

        .header-search:focus-within {
          background: var(--bg-primary);
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .header-search .search-icon {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .header-search input {
          flex: 1;
          border: none;
          background: none;
          padding: var(--space-1) var(--space-2);
          font-size: var(--text-sm);
          outline: none;
        }

        .header-search .search-btn {
          display: none;
          padding: var(--space-2) var(--space-4);
          background: var(--primary-500);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: var(--text-sm);
        }

        @media (min-width: 768px) {
          .header-search .search-btn {
            display: block;
          }
        }

        .header-search .search-btn:hover {
          background: var(--primary-600);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .header-action-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .header-action-btn:hover {
          background: var(--gray-100);
          color: var(--primary-600);
        }

        .action-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: var(--accent-red);
          color: white;
          font-size: 10px;
          font-weight: 700;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-divider {
          width: 1px;
          height: 24px;
          background: var(--gray-200);
          margin: 0 var(--space-2);
          display: none;
        }

        @media (min-width: 768px) {
          .header-divider {
            display: block;
          }
        }

        .header-user {
          display: none;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .header-user {
            display: flex;
          }
        }

        .header-user:hover {
          background: var(--gray-100);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-name {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-primary);
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header-auth {
          display: none;
          align-items: center;
          gap: var(--space-2);
        }

        @media (min-width: 768px) {
          .header-auth {
            display: flex;
          }
        }

        .header-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: var(--text-secondary);
        }

        @media (min-width: 768px) {
          .header-menu-toggle {
            display: none;
          }
        }

        .header-nav {
          border-top: 1px solid var(--gray-100);
          display: none;
        }

        @media (min-width: 768px) {
          .header-nav {
            display: block;
          }
        }

        .nav-list {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          list-style: none;
          padding: var(--space-2) 0;
          overflow-x: auto;
        }

        .nav-list li a {
          display: block;
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .nav-list li a:hover {
          background: var(--gray-100);
          color: var(--primary-600);
        }

        .nav-flash-sale {
          background: linear-gradient(135deg, var(--accent-red) 0%, var(--accent-pink) 100%) !important;
          color: white !important;
          animation: pulse 2s ease infinite;
        }
      `}</style>
    </header>
  )
}
