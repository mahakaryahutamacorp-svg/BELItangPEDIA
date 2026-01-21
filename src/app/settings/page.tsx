'use client'

import Link from 'next/link'
import { ArrowLeft, User, MapPin, CreditCard, Bell, Lock, ChevronRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { useAuthStore } from '@/store/authStore'

export default function SettingsPage() {
    const { user } = useAuthStore()
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)

    const sections = [
        {
            title: 'Akun',
            items: [
                { icon: User, label: 'Edit Profil', href: '#edit-profile' },
                { icon: Lock, label: 'Ubah Password', href: '#change-password' },
            ]
        },
        {
            title: 'Alamat',
            items: [
                { icon: MapPin, label: 'Alamat Pengiriman', href: '#addresses' },
            ]
        },
        {
            title: 'Pembayaran',
            items: [
                { icon: CreditCard, label: 'Metode Pembayaran', href: '#payment' },
            ]
        }
    ]

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <Link href="/profile" className="back-link">
                            <ArrowLeft size={20} />
                            <span>Profil</span>
                        </Link>
                    </div>

                    {/* Page Header */}
                    <div className="page-header">
                        <h1>Pengaturan</h1>
                    </div>

                    {/* Settings Sections */}
                    {sections.map((section) => (
                        <div key={section.title} className="settings-section">
                            <h2 className="section-title">{section.title}</h2>
                            <div className="settings-list">
                                {section.items.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <Link key={item.label} href={item.href} className="settings-item">
                                            <div className="item-left">
                                                <div className="item-icon">
                                                    <Icon size={20} />
                                                </div>
                                                <span>{item.label}</span>
                                            </div>
                                            <ChevronRight size={18} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Notifications Toggle */}
                    <div className="settings-section">
                        <h2 className="section-title">Notifikasi</h2>
                        <div className="settings-list">
                            <div className="settings-item toggle">
                                <div className="item-left">
                                    <div className="item-icon">
                                        <Bell size={20} />
                                    </div>
                                    <span>Notifikasi Push</span>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notificationsEnabled}
                                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                    />
                                    <span className="toggle-slider" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="settings-section danger">
                        <h2 className="section-title">Zona Bahaya</h2>
                        <div className="settings-list">
                            <button className="settings-item danger-item">
                                <div className="item-left">
                                    <div className="item-icon danger">
                                        <Trash2 size={20} />
                                    </div>
                                    <span>Hapus Akun</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Version */}
                    <div className="version-info">
                        <p>BELItangPEDIA v1.0.0</p>
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
          margin-bottom: var(--space-6);
        }

        .page-header h1 {
          font-size: var(--text-xl);
          font-weight: 700;
        }

        .settings-section {
          margin-bottom: var(--space-6);
        }

        .section-title {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-3);
        }

        .settings-list {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .settings-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-light);
          color: var(--text-secondary);
          width: 100%;
          text-align: left;
        }

        .settings-item:last-child {
          border-bottom: none;
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .item-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--gray-100);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-icon.danger {
          background: var(--accent-red);
          color: white;
        }

        .item-left span {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-primary);
        }

        .danger-item .item-left span {
          color: var(--accent-red);
        }

        .toggle-switch {
          position: relative;
          width: 50px;
          height: 28px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gray-300);
          border-radius: 28px;
          transition: 0.3s;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle-switch input:checked + .toggle-slider {
          background: var(--primary-500);
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }

        .version-info {
          text-align: center;
          padding: var(--space-6);
        }

        .version-info p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }
      `}</style>
        </>
    )
}
