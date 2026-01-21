'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Store, User, Mail, Phone, MapPin, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'
import { useAuthStore } from '@/store/authStore'

export default function SellerRegisterPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { createStore, isLoading, error: storeError, store } = useStoreStore()
  const { user: authUser, setUser: setAuthUser } = useAuthStore()

  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  // Pre-fill form with user data
  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        ownerName: authUser.full_name || '',
        email: authUser.email || '',
        phone: authUser.phone || ''
      }))
    }
  }, [authUser])

  // Redirect if user already has a store
  useEffect(() => {
    if (store) {
      router.push('/seller')
    }
  }, [store, router])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/seller/register')
    }
  }, [user, authLoading, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Nama toko harus diisi'
    } else if (formData.storeName.length < 3) {
      newErrors.storeName = 'Nama toko minimal 3 karakter'
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Nama pemilik harus diisi'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor HP harus diisi'
    } else if (!/^08[0-9]{8,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor HP tidak valid'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat toko harus diisi'
    } else if (formData.address.length < 10) {
      newErrors.address = 'Alamat terlalu pendek, minimal 10 karakter'
    }

    if (!formData.category) {
      newErrors.category = 'Pilih kategori produk'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!user) {
      router.push('/auth/login?redirect=/seller/register')
      return
    }

    const result = await createStore({
      user_id: user.id,
      name: formData.storeName.trim(),
      description: formData.description.trim() || `Toko ${formData.category}`,
      address: formData.address.trim(),
    })

    if (result.success) {
      // Update user role in auth store
      if (authUser) {
        setAuthUser({
          ...authUser,
          role: 'seller'
        })
      }

      setSuccess(true)

      // Redirect to seller dashboard after short delay
      setTimeout(() => {
        router.push('/seller')
      }, 2000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner" size={48} />
        <p>Memuat...</p>
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

  // Success state
  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <CheckCircle size={64} className="success-icon" />
          <h1>Pendaftaran Berhasil! 🎉</h1>
          <p>Toko Anda telah berhasil didaftarkan. Anda akan dialihkan ke dashboard seller.</p>
          <div className="redirect-text">
            <Loader2 className="spinner" size={16} />
            <span>Mengalihkan...</span>
          </div>
        </div>
        <style jsx>{`
                    .success-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: var(--bg-secondary);
                        padding: var(--space-4);
                    }
                    .success-card {
                        background: var(--bg-primary);
                        padding: var(--space-8);
                        border-radius: var(--radius-xl);
                        text-align: center;
                        max-width: 400px;
                    }
                    .success-card :global(.success-icon) {
                        color: var(--secondary-500);
                        margin-bottom: var(--space-4);
                    }
                    .success-card h1 {
                        font-size: var(--text-xl);
                        margin-bottom: var(--space-2);
                    }
                    .success-card p {
                        color: var(--text-secondary);
                        margin-bottom: var(--space-6);
                    }
                    .redirect-text {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: var(--space-2);
                        color: var(--text-tertiary);
                        font-size: var(--text-sm);
                    }
                    .redirect-text :global(.spinner) {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/seller" className="back-link">
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="page-header">
            <div className="header-icon">
              <Store size={32} />
            </div>
            <div className="header-text">
              <h1>Daftar Sebagai Seller</h1>
              <p>Mulai jual produkmu di BELItangPEDIA</p>
            </div>
          </div>

          {/* Error Alert */}
          {storeError && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <span>{storeError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form className="register-form" onSubmit={handleSubmit}>
            <div className={`form-group ${errors.storeName ? 'has-error' : ''}`}>
              <label>
                <Store size={16} />
                <span>Nama Toko *</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Toko Berkah"
                value={formData.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                disabled={isLoading}
              />
              {errors.storeName && <span className="error-text">{errors.storeName}</span>}
            </div>

            <div className={`form-group ${errors.ownerName ? 'has-error' : ''}`}>
              <label>
                <User size={16} />
                <span>Nama Pemilik *</span>
              </label>
              <input
                type="text"
                placeholder="Nama lengkap"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                disabled={isLoading}
              />
              {errors.ownerName && <span className="error-text">{errors.ownerName}</span>}
            </div>

            <div className="form-group">
              <label>
                <Mail size={16} />
                <span>Email</span>
              </label>
              <input
                type="email"
                placeholder="email@contoh.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={true}
                className="disabled"
              />
              <span className="helper-text">Email diambil dari akun Anda</span>
            </div>

            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
              <label>
                <Phone size={16} />
                <span>Nomor HP/WhatsApp *</span>
              </label>
              <input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isLoading}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className={`form-group ${errors.address ? 'has-error' : ''}`}>
              <label>
                <MapPin size={16} />
                <span>Alamat Toko *</span>
              </label>
              <textarea
                placeholder="Alamat lengkap toko"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={isLoading}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
              <label>Kategori Produk Utama *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Pilih kategori</option>
                <option value="makanan">🍜 Makanan</option>
                <option value="minuman">🧃 Minuman</option>
                <option value="elektronik">📱 Elektronik</option>
                <option value="fashion">👕 Fashion</option>
                <option value="kesehatan">💊 Kesehatan</option>
                <option value="kecantikan">💄 Kecantikan</option>
                <option value="rumah-tangga">🏠 Rumah Tangga</option>
                <option value="lainnya">📦 Lainnya</option>
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label>Deskripsi Toko (opsional)</label>
              <textarea
                placeholder="Ceritakan tentang toko Anda..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="terms-note">
              Dengan mendaftar, Anda menyetujui <Link href="/terms">Syarat & Ketentuan</Link> dan <Link href="/privacy">Kebijakan Privasi</Link> kami.
            </p>
          </form>
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
          max-width: 480px;
          margin: 0 auto;
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
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          padding: var(--space-6);
          background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
          border-radius: var(--radius-xl);
          color: white;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-xl);
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-text h1 {
          font-size: var(--text-xl);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: #fee2e2;
          color: #991b1b;
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          font-size: var(--text-sm);
        }

        .register-form {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-group.has-error input,
        .form-group.has-error textarea,
        .form-group.has-error select {
          border-color: #ef4444;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 500;
          margin-bottom: var(--space-2);
          color: var(--text-secondary);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary-500);
        }

        .form-group input.disabled {
          background: var(--gray-100);
          color: var(--text-tertiary);
          cursor: not-allowed;
        }

        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .error-text {
          display: block;
          color: #ef4444;
          font-size: var(--text-xs);
          margin-top: var(--space-1);
        }

        .helper-text {
          display: block;
          color: var(--text-tertiary);
          font-size: var(--text-xs);
          margin-top: var(--space-1);
        }

        .btn-lg {
          width: 100%;
          padding: var(--space-4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-size: var(--text-base);
          margin-top: var(--space-6);
        }

        .btn-lg:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-lg :global(.spinner) {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .terms-note {
          margin-top: var(--space-4);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-align: center;
        }

        .terms-note :global(a) {
          color: var(--primary-600);
        }
      `}</style>
    </>
  )
}
