'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  Store,
  LogOut,
  Package,
  Settings
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartItemCount = useCartStore((state) => state.getTotalItems())
  const { user, isAuthenticated, logout } = useAuthStore()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="header-top">
        <div className="container header-top-content">
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
        <div className="container header-main-content">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <span className="logo-text">
              <span className="logo-beli">BELI</span>
              <span className="logo-tang">tang</span>
              <span className="logo-pedia">PEDIA</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form className="header-search" onSubmit={handleSearch}>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Cari produk, toko, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">Cari</button>
          </form>

          {/* Actions */}
          <div className="header-actions">
            <Link href="/wishlist" className="header-action-btn hide-mobile">
              <Heart size={22} />
            </Link>

            <Link href="/notifications" className="header-action-btn hide-mobile">
              <Bell size={22} />
              <span className="action-badge">3</span>
            </Link>

            <Link href="/cart" className="header-action-btn cart-btn">
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="action-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
              )}
            </Link>

            <div className="header-divider hide-mobile" />

            {isAuthenticated ? (
              <div className="header-user-wrapper hide-mobile">
                <button
                  className="header-user"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    {user?.avatar_url ? (
                      <Image src={user.avatar_url} alt={user.full_name || 'User'} width={32} height={32} />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <span className="user-name">{user?.full_name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown size={16} />
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <Link href="/profile" className="dropdown-item">
                      <User size={18} />
                      <span>Profil Saya</span>
                    </Link>
                    <Link href="/orders" className="dropdown-item">
                      <Package size={18} />
                      <span>Pesanan Saya</span>
                    </Link>
                    <Link href="/wishlist" className="dropdown-item">
                      <Heart size={18} />
                      <span>Wishlist</span>
                    </Link>
                    <Link href="/settings" className="dropdown-item">
                      <Settings size={18} />
                      <span>Pengaturan</span>
                    </Link>
                    <div className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={18} />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="header-auth hide-mobile">
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
          <ul className="nav-list hide-scrollbar">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {isAuthenticated ? (
              <div className="mobile-user-info">
                <div className="user-avatar large">
                  {user?.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.full_name || 'User'} width={48} height={48} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <p className="user-name">{user?.full_name || 'User'}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link href="/auth/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>Masuk</Link>
                <Link href="/auth/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Daftar</Link>
              </div>
            )}

            <div className="mobile-menu-divider" />

            <nav className="mobile-menu-nav">
              <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                <Package size={20} />
                <span>Pesanan Saya</span>
              </Link>
              <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <Heart size={20} />
                <span>Wishlist</span>
              </Link>
              <Link href="/notifications" onClick={() => setIsMenuOpen(false)}>
                <Bell size={20} />
                <span>Notifikasi</span>
              </Link>
              <Link href="/seller" onClick={() => setIsMenuOpen(false)}>
                <Store size={20} />
                <span>Mulai Berjualan</span>
              </Link>
            </nav>

            {isAuthenticated && (
              <>
                <div className="mobile-menu-divider" />
                <button className="mobile-logout" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Keluar</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
                .header {
                    position: sticky;
                    top: 0;
                    z-index: var(--z-sticky);
                    background: var(--bg-primary);
                    transition: box-shadow var(--transition-fast);
                }

                .header.scrolled {
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

                .header-top-content {
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
                    transition: color var(--transition-fast);
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
                    transition: color var(--transition-fast);
                }

                .header-top-links a:hover {
                    color: var(--primary-600);
                }

                .header-main {
                    padding: var(--space-3) 0;
                }

                .header-main-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                }

                .header-logo {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    flex-shrink: 0;
                }

                .logo-text {
                    display: block;
                    font-family: var(--font-display);
                    font-weight: 800;
                    font-size: var(--text-lg);
                }

                @media (min-width: 768px) {
                    .logo-text {
                        font-size: var(--text-xl);
                    }
                }

                .logo-beli {
                    color: var(--primary-600);
                }

                .logo-tang {
                    color: var(--gray-500);
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
                    border-radius: var(--radius-xl);
                    padding: var(--space-2) var(--space-3);
                    border: 2px solid transparent;
                    transition: all var(--transition-fast);
                }

                .header-search:focus-within {
                    background: var(--bg-primary);
                    border-color: var(--primary-500);
                    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
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
                    background: var(--bg-gradient);
                    color: white;
                    border-radius: var(--radius-lg);
                    font-weight: 600;
                    font-size: var(--text-sm);
                    transition: all var(--transition-fast);
                }

                @media (min-width: 768px) {
                    .header-search .search-btn {
                        display: block;
                    }
                }

                .header-search .search-btn:hover {
                    transform: scale(1.02);
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                }

                .header-action-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-lg);
                    color: var(--text-secondary);
                    transition: all var(--transition-fast);
                }

                .header-action-btn:hover {
                    background: var(--gray-100);
                    color: var(--primary-600);
                }

                .action-badge {
                    position: absolute;
                    top: 4px;
                    right: 4px;
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
                }

                .header-user-wrapper {
                    position: relative;
                }

                .header-user {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    transition: background var(--transition-fast);
                }

                .header-user:hover {
                    background: var(--gray-100);
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-full);
                    background: var(--primary-100);
                    color: var(--primary-600);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .user-avatar.large {
                    width: 48px;
                    height: 48px;
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

                .user-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    width: 220px;
                    background: var(--bg-primary);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-xl);
                    padding: var(--space-2);
                    animation: fadeInUp 0.2s ease;
                    z-index: var(--z-dropdown);
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-3);
                    color: var(--text-secondary);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-fast);
                    width: 100%;
                    text-align: left;
                }

                .dropdown-item:hover {
                    background: var(--gray-100);
                    color: var(--text-primary);
                }

                .dropdown-item.logout {
                    color: var(--accent-red);
                }

                .dropdown-divider {
                    height: 1px;
                    background: var(--border-light);
                    margin: var(--space-2) 0;
                }

                .header-auth {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
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
                    border-top: 1px solid var(--border-light);
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
                    padding: var(--space-2) 0;
                    overflow-x: auto;
                }

                .nav-list li a {
                    display: block;
                    padding: var(--space-2) var(--space-3);
                    font-size: var(--text-sm);
                    font-weight: 500;
                    color: var(--text-secondary);
                    border-radius: var(--radius-lg);
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

                .hide-mobile {
                    display: none;
                }

                @media (min-width: 768px) {
                    .hide-mobile {
                        display: flex;
                    }
                }

                /* Mobile Menu */
                .mobile-menu {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--bg-primary);
                    z-index: var(--z-modal);
                    animation: fadeIn 0.2s ease;
                    overflow-y: auto;
                }

                .mobile-menu-content {
                    padding: var(--space-6);
                }

                .mobile-user-info {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    margin-bottom: var(--space-4);
                }

                .mobile-user-info .user-name {
                    font-size: var(--text-base);
                    font-weight: 600;
                    max-width: none;
                }

                .mobile-user-info .user-email {
                    font-size: var(--text-sm);
                    color: var(--text-tertiary);
                }

                .mobile-auth-buttons {
                    display: flex;
                    gap: var(--space-3);
                }

                .mobile-auth-buttons .btn {
                    flex: 1;
                }

                .mobile-menu-divider {
                    height: 1px;
                    background: var(--border-light);
                    margin: var(--space-4) 0;
                }

                .mobile-menu-nav {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .mobile-menu-nav a {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    color: var(--text-secondary);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-fast);
                }

                .mobile-menu-nav a:hover {
                    background: var(--gray-100);
                    color: var(--text-primary);
                }

                .mobile-logout {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    color: var(--accent-red);
                    width: 100%;
                    border-radius: var(--radius-lg);
                }

                .mobile-logout:hover {
                    background: var(--gray-100);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </header>
  )
}
