'use client'

import Link from 'next/link'
import { ArrowLeft, Bell, Package, Tag, Megaphone, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

const notifications = [
    {
        id: 1,
        type: 'order',
        title: 'Pesanan Dikirim',
        message: 'Pesanan #ORD001 sedang dalam perjalanan ke alamat Anda',
        time: '2 jam lalu',
        read: false,
        icon: Package
    },
    {
        id: 2,
        type: 'promo',
        title: 'Flash Sale Dimulai!',
        message: 'Diskon hingga 70% untuk produk elektronik. Jangan sampai kehabisan!',
        time: '5 jam lalu',
        read: false,
        icon: Tag
    },
    {
        id: 3,
        type: 'info',
        title: 'Selamat Datang di BELItangPEDIA',
        message: 'Nikmati voucher diskon 10% untuk pembelian pertama Anda',
        time: '1 hari lalu',
        read: true,
        icon: Megaphone
    },
    {
        id: 4,
        type: 'order',
        title: 'Pesanan Selesai',
        message: 'Pesanan #ORD000 telah selesai. Berikan ulasan untuk mendapat poin!',
        time: '3 hari lalu',
        read: true,
        icon: CheckCircle
    }
]

export default function NotificationsPage() {
    const [notifs, setNotifs] = useState(notifications)

    const markAsRead = (id: number) => {
        setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const markAllAsRead = () => {
        setNotifs(notifs.map(n => ({ ...n, read: true })))
    }

    const unreadCount = notifs.filter(n => !n.read).length

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
                        <div className="header-left">
                            <div className="header-icon">
                                <Bell size={32} />
                            </div>
                            <div className="header-text">
                                <h1>Notifikasi</h1>
                                <p>{unreadCount} belum dibaca</p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={markAllAsRead}>
                                Tandai Semua Dibaca
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="notif-list">
                        {notifs.map((notif) => {
                            const Icon = notif.icon
                            return (
                                <div
                                    key={notif.id}
                                    className={`notif-item ${!notif.read ? 'unread' : ''}`}
                                    onClick={() => markAsRead(notif.id)}
                                >
                                    <div className={`notif-icon ${notif.type}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="notif-content">
                                        <h3>{notif.title}</h3>
                                        <p>{notif.message}</p>
                                        <span className="notif-time">{notif.time}</span>
                                    </div>
                                    {!notif.read && <div className="unread-dot" />}
                                </div>
                            )
                        })}
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
          justify-content: space-between;
          margin-bottom: var(--space-6);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-xl);
          background: var(--primary-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-text h1 {
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .header-text p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .mark-all-btn {
          font-size: var(--text-xs);
          color: var(--primary-600);
          font-weight: 500;
        }

        .notif-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .notif-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }

        .notif-item.unread {
          background: var(--primary-50);
        }

        .notif-item:hover {
          box-shadow: var(--shadow-sm);
        }

        .notif-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-icon.order {
          background: var(--secondary-100);
          color: var(--secondary-600);
        }

        .notif-icon.promo {
          background: var(--accent-yellow);
          color: white;
        }

        .notif-icon.info {
          background: var(--primary-100);
          color: var(--primary-600);
        }

        .notif-content {
          flex: 1;
          min-width: 0;
        }

        .notif-content h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: 4px;
        }

        .notif-content p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .notif-time {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--primary-500);
          flex-shrink: 0;
        }
      `}</style>
        </>
    )
}
