'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Chrome, User, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function RegisterPage() {
  const router = useRouter()
  const { signUpWithEmail, signInWithGoogle } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak sama')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setIsLoading(true)

    const { error } = await signUpWithEmail(
      formData.email,
      formData.password,
      formData.fullName,
      formData.phone
    )

    if (error) {
      setError(getErrorMessage(error.message))
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setError(null)

    const { error } = await signInWithGoogle()

    if (error) {
      setError('Gagal daftar dengan Google. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  const getErrorMessage = (message: string) => {
    if (message.includes('already registered')) {
      return 'Email sudah terdaftar. Silakan login.'
    }
    if (message.includes('invalid email')) {
      return 'Format email tidak valid'
    }
    return 'Terjadi kesalahan. Silakan coba lagi.'
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="success-container">
          <CheckCircle size={64} className="success-icon" />
          <h1>Registrasi Berhasil!</h1>
          <p>Silakan cek email Anda untuk verifikasi akun.</p>
          <Link href="/auth/login" className="btn btn-primary">
            Ke Halaman Login
          </Link>
        </div>
        <style jsx>{`
                    .auth-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
                    }
                    .success-container {
                        text-align: center;
                        padding: var(--space-8);
                        background: white;
                        border-radius: var(--radius-2xl);
                        box-shadow: var(--shadow-xl);
                        max-width: 400px;
                    }
                    .success-icon {
                        color: var(--secondary-500);
                        margin-bottom: var(--space-4);
                    }
                    h1 {
                        font-size: var(--text-2xl);
                        margin-bottom: var(--space-2);
                    }
                    p {
                        color: var(--text-secondary);
                        margin-bottom: var(--space-6);
                    }
                `}</style>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <Link href="/" className="logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">
              <span className="logo-beli">BELI</span>
              <span className="logo-tang">tang</span>
              <span className="logo-pedia">PEDIA</span>
            </span>
          </Link>
          <h1>Bergabung Sekarang!</h1>
          <p>Nikmati kemudahan belanja dan berjualan di Belitang.</p>
          <div className="features">
            <div className="feature">
              <span>🛍️</span>
              <span>Belanja Mudah & Aman</span>
            </div>
            <div className="feature">
              <span>🏪</span>
              <span>Buka Toko Gratis</span>
            </div>
            <div className="feature">
              <span>💰</span>
              <span>Tanpa Biaya Komisi</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <div className="auth-form-card">
            <h2>Daftar Akun</h2>
            <p className="subtitle">Buat akun untuk mulai berbelanja</p>

            {error && (
              <div className="error-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn-google"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              <Chrome size={20} />
              Daftar dengan Google
            </button>

            <div className="divider">
              <span>atau daftar dengan email</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nama Lengkap</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nama lengkap Anda"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Nomor HP</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Konfirmasi Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="terms">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>
                    Saya setuju dengan{' '}
                    <Link href="/terms">Syarat & Ketentuan</Link> dan{' '}
                    <Link href="/privacy">Kebijakan Privasi</Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="login-link">
              Sudah punya akun? <Link href="/auth/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
        }
        .auth-container {
          display: flex;
          min-height: 100vh;
        }
        .auth-branding {
          flex: 1;
          display: none;
          flex-direction: column;
          justify-content: center;
          padding: var(--space-16);
          color: white;
        }
        @media (min-width: 1024px) {
          .auth-branding { display: flex; }
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-8);
        }
        .logo-icon { font-size: 40px; }
        .logo-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: var(--text-2xl);
        }
        .logo-beli { color: white; }
        .logo-tang { opacity: 0.7; font-weight: 400; }
        .logo-pedia { color: var(--secondary-300); }
        .auth-branding h1 {
          font-size: var(--text-4xl);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }
        .auth-branding > p {
          font-size: var(--text-lg);
          opacity: 0.9;
          margin-bottom: var(--space-8);
        }
        .features {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-base);
        }
        .feature span:first-child { font-size: 24px; }
        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          background: var(--bg-secondary);
          overflow-y: auto;
        }
        @media (min-width: 1024px) {
          .auth-form-container { max-width: 500px; }
        }
        .auth-form-card {
          width: 100%;
          max-width: 400px;
          background: var(--bg-primary);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-xl);
        }
        .auth-form-card h2 {
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .subtitle {
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: #FEE2E2;
          border: 1px solid #FECACA;
          border-radius: var(--radius-lg);
          color: #DC2626;
          font-size: var(--text-sm);
          margin-bottom: var(--space-4);
        }
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--bg-primary);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-lg);
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-google:hover {
          border-color: var(--primary-500);
          background: var(--gray-50);
        }
        .btn-google:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .divider {
          display: flex;
          align-items: center;
          margin: var(--space-6) 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-light);
        }
        .divider span {
          padding: 0 var(--space-4);
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }
        .input-group { margin-bottom: var(--space-4); }
        .input-group label {
          display: block;
          font-size: var(--text-sm);
          font-weight: 500;
          margin-bottom: var(--space-2);
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: var(--space-3);
          color: var(--text-tertiary);
        }
        .input-wrapper input {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          padding-left: var(--space-10);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-lg);
          font-size: var(--text-base);
          transition: all var(--transition-fast);
        }
        .input-wrapper input:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .toggle-password {
          position: absolute;
          right: var(--space-3);
          color: var(--text-tertiary);
          cursor: pointer;
        }
        .terms {
          margin-bottom: var(--space-6);
        }
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          cursor: pointer;
        }
        .checkbox-label a {
          color: var(--primary-600);
        }
        .submit-btn { width: 100%; }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-link {
          text-align: center;
          margin-top: var(--space-6);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }
        .login-link a {
          color: var(--primary-600);
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
