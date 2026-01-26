'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, User, Camera, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="login-prompt">
              <User size={64} />
              <h2>Masuk untuk Melanjutkan</h2>
              <p>Silakan masuk untuk melihat profil Anda</p>
              <Link href="/auth/login" className="btn btn-primary">
                Masuk Sekarang
              </Link>
            </div>
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
          .login-prompt {
            text-align: center;
            padding: var(--space-12);
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
          }
          .login-prompt svg {
            color: var(--gray-300);
            margin-bottom: var(--space-4);
          }
          .login-prompt h2 {
            font-size: var(--text-lg);
            font-weight: 600;
            margin-bottom: var(--space-2);
          }
          .login-prompt p {
            color: var(--text-tertiary);
            margin-bottom: var(--space-6);
          }
        `}</style>
      </>
    )
  }

  const menuItems = [
    { icon: Package, label: 'Pesanan Saya', href: '/orders', count: 2 },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', count: 4 },
    { icon: MapPin, label: 'Alamat Pengiriman', href: '/settings' },
    { icon: CreditCard, label: 'Metode Pembayaran', href: '/settings' },
  ]

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

          {/* Profile Header */}
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div className="avatar" style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <User size={40} />
                )}
              </div>
              <button className="avatar-edit" aria-label="Ubah foto profil">
                <Camera size={14} />
              </button>
            </div>
            <div className="profile-info">
              <h1>{user?.full_name || 'User'}</h1>
              <p>{user?.email}</p>
              <p className="phone">{user?.phone || '-'}</p>
            </div>
            <Link href="/settings" className="edit-btn">Edit Profil</Link>
          </div>

          {/* Menu Items */}
          <div className="menu-section">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} href={item.href} className="menu-item">
                  <div className="menu-left">
                    <div className="menu-icon">
                      <Icon size={20} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <div className="menu-right">
                    {item.count && <span className="count">{item.count}</span>}
                    <ChevronRight size={18} />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
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

        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-6);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-4);
        }

        .avatar-wrapper {
          position: relative;
          margin-bottom: var(--space-3);
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: var(--primary-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-edit {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background: var(--primary-500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-primary);
        }

        .profile-info h1 {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: 4px;
        }

        .profile-info p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .profile-info .phone {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .edit-btn {
          margin-top: var(--space-3);
          padding: var(--space-2) var(--space-4);
          background: var(--primary-50);
          color: var(--primary-600);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .menu-section {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-light);
        }

        .menu-item:last-child {
          border-bottom: none;
        }

        .menu-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .menu-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--gray-100);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-left span {
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .menu-right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-tertiary);
        }

        .count {
          padding: 2px 8px;
          background: var(--primary-500);
          color: white;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          color: var(--accent-red);
          font-weight: 500;
        }
      `}</style>
    </>
  )
}
