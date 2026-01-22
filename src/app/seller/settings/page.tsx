'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Settings,
    Store,
    User,
    Bell,
    Shield,
    HelpCircle,
    ChevronRight,
    Camera,
    Save,
    Loader2,
    Check
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'
import { supabase } from '@/lib/supabase'

export default function SellerSettingsPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { store, fetchMyStore, updateStore, isLoading: storeLoading, hasFetched } = useStoreStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
    })

    // Fetch store
    useEffect(() => {
        if (user?.id) {
            fetchMyStore(user.id)
        }
    }, [user?.id, fetchMyStore])

    // Redirect if not logged in or no store
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?redirect=/seller/settings')
        }
        if (hasFetched && !storeLoading && user && !store) {
            router.push('/seller/register')
        }
    }, [user, authLoading, store, storeLoading, hasFetched, router])

    // Populate form
    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name || '',
                description: store.description || '',
                address: store.address || '',
            })
        }
    }, [store])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSave = async () => {
        if (!store?.id) return

        setIsSaving(true)
        setMessage(null)

        try {
            const result = await updateStore(store.id, formData)

            if (result.success) {
                setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' })
            } else {
                setMessage({ type: 'error', text: result.error || 'Gagal menyimpan pengaturan' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        } finally {
            setIsSaving(false)
        }
    }

    if (authLoading || storeLoading || !hasFetched) {
        return (
            <div className="loading-container">
                <Loader2 className="spinner" size={48} />
                <p>Memuat pengaturan...</p>
                <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--bg-secondary);
          }
          .loading-container :global(.spinner) {
            animation: spin 1s linear infinite;
            color: var(--primary-500);
            margin-bottom: var(--space-4);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        )
    }

    if (!store) return null

    const menuItems = [
        { icon: Bell, label: 'Notifikasi', href: '#', coming: true },
        { icon: Shield, label: 'Keamanan', href: '#', coming: true },
        { icon: HelpCircle, label: 'Bantuan', href: '/help' },
    ]

    return (
        <div className="settings-page">
            <header className="page-header">
                <Link href="/seller" className="back-btn">
                    <ArrowLeft size={24} />
                </Link>
                <h1>Pengaturan Toko</h1>
                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 size={20} className="spinner" /> : <Save size={20} />}
                </button>
            </header>

            {/* Message */}
            {message && (
                <div className={`message ${message.type}`}>
                    {message.type === 'success' && <Check size={16} />}
                    {message.text}
                </div>
            )}

            {/* Store Logo */}
            <section className="logo-section">
                <div className="logo-wrapper">
                    {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="logo-img" />
                    ) : (
                        <div className="logo-placeholder">
                            <Store size={40} />
                        </div>
                    )}
                    <button className="logo-edit">
                        <Camera size={16} />
                    </button>
                </div>
                <p>Logo Toko</p>
            </section>

            {/* Store Info Form */}
            <section className="form-section">
                <h2>Informasi Toko</h2>

                <div className="form-group">
                    <label htmlFor="name">Nama Toko</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama toko"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Deskripsi Toko</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Jelaskan tentang toko Anda"
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Alamat Toko</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Alamat lengkap toko"
                        rows={3}
                    />
                </div>
            </section>

            {/* Additional Settings */}
            <section className="menu-section">
                <h2>Pengaturan Lainnya</h2>
                <div className="menu-list">
                    {menuItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`menu-item ${item.coming ? 'disabled' : ''}`}
                            onClick={e => item.coming && e.preventDefault()}
                        >
                            <div className="menu-icon">
                                <item.icon size={20} />
                            </div>
                            <span className="menu-label">{item.label}</span>
                            {item.coming ? (
                                <span className="coming-badge">Segera</span>
                            ) : (
                                <ChevronRight size={20} className="menu-arrow" />
                            )}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Store Stats */}
            <section className="stats-section">
                <h2>Statistik Toko</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-value">{store.rating || '0.0'}</span>
                        <span className="stat-label">Rating</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{store.total_reviews || 0}</span>
                        <span className="stat-label">Ulasan</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{store.total_products || 0}</span>
                        <span className="stat-label">Produk</span>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .settings-page {
          min-height: 100vh;
          background: var(--bg-secondary);
          padding-bottom: var(--space-8);
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .back-btn {
          color: var(--text-secondary);
        }

        .page-header h1 {
          flex: 1;
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .save-btn {
          color: var(--primary-600);
        }

        .save-btn:disabled {
          opacity: 0.5;
        }

        .save-btn :global(.spinner) {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .message {
          margin: var(--space-4);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
        }

        .message.success {
          background: var(--secondary-100);
          color: var(--secondary-700);
        }

        .message.error {
          background: #fef2f2;
          color: var(--accent-red);
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-6);
          background: var(--bg-primary);
          margin-bottom: var(--space-4);
        }

        .logo-wrapper {
          position: relative;
          margin-bottom: var(--space-2);
        }

        .logo-img,
        .logo-placeholder {
          width: 100px;
          height: 100px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .logo-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gray-100);
          color: var(--text-tertiary);
        }

        .logo-edit {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--primary-500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-section p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .form-section,
        .menu-section,
        .stats-section {
          padding: var(--space-4);
          background: var(--bg-primary);
          margin-bottom: var(--space-4);
        }

        .form-section h2,
        .menu-section h2,
        .stats-section h2 {
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-group label {
          display: block;
          font-size: var(--text-sm);
          font-weight: 500;
          margin-bottom: var(--space-2);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-500);
        }

        .menu-list {
          display: flex;
          flex-direction: column;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--border-light);
        }

        .menu-item:last-child {
          border-bottom: none;
        }

        .menu-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .menu-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .menu-label {
          flex: 1;
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .coming-badge {
          font-size: var(--text-xs);
          padding: 2px 8px;
          background: var(--gray-100);
          border-radius: var(--radius-full);
          color: var(--text-tertiary);
        }

        .menu-arrow {
          color: var(--text-tertiary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          text-align: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--primary-600);
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }
      `}</style>
        </div>
    )
}
