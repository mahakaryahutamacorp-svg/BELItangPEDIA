'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Chrome, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const { signInWithEmail, signInWithGoogle } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await signInWithEmail(email, password)

    if (error) {
      setError(getErrorMessage(error.message))
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const { error } = await signInWithGoogle()

    if (error) {
      setError('Gagal login dengan Google. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  const getErrorMessage = (message: string) => {
    if (message.includes('Invalid login credentials')) {
      return 'Email atau password salah'
    }
    if (message.includes('Email not confirmed')) {
      return 'Email belum diverifikasi. Cek inbox email Anda.'
    }
    return 'Terjadi kesalahan. Silakan coba lagi.'
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
          <h1>Selamat Datang!</h1>
          <p>Marketplace lokal untuk masyarakat Belitang dan sekitarnya.</p>
          <div className="features">
            <div className="feature">
              <span>🚚</span>
              <span>Pengiriman Cepat 1-2 Jam</span>
            </div>
            <div className="feature">
              <span>💵</span>
              <span>Bayar di Tempat (COD)</span>
            </div>
            <div className="feature">
              <span>🏪</span>
              <span>Dukung UMKM Lokal</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <div className="auth-form-card">
            <h2>Masuk</h2>
            <p className="subtitle">Masuk ke akun Anda untuk melanjutkan</p>

            {error && (
              <div className="error-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn-google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome size={20} />
              Masuk dengan Google
            </button>

            <div className="divider">
              <span>atau masuk dengan email</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Ingat saya</span>
                </label>
                <Link href="/auth/forgot-password" className="forgot-link">
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="register-link">
              Belum punya akun? <Link href="/auth/register">Daftar sekarang</Link>
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
          .auth-branding {
            display: flex;
          }
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-8);
        }

        .logo-icon {
          font-size: 40px;
        }

        .logo-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: var(--text-2xl);
        }

        .logo-beli {
          color: white;
        }

        .logo-tang {
          opacity: 0.7;
          font-weight: 400;
        }

        .logo-pedia {
          color: var(--secondary-300);
        }

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

        .feature span:first-child {
          font-size: 24px;
        }

        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          background: var(--bg-secondary);
        }

        @media (min-width: 1024px) {
          .auth-form-container {
            max-width: 500px;
          }
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

        .divider::before,
        .divider::after {
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

        .input-group {
          margin-bottom: var(--space-4);
        }

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

        .toggle-password:hover {
          color: var(--text-secondary);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .forgot-link {
          font-size: var(--text-sm);
          color: var(--primary-600);
        }

        .submit-btn {
          width: 100%;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-link {
          text-align: center;
          margin-top: var(--space-6);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .register-link a {
          color: var(--primary-600);
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
