'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Chrome, User, Phone } from 'lucide-react'

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert('Password tidak cocok!')
            return
        }
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        window.location.href = '/'
    }

    const handleGoogleRegister = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        window.location.href = '/'
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
                    <p>Daftar gratis dan nikmati kemudahan belanja lokal.</p>
                    <div className="features">
                        <div className="feature">
                            <span>✨</span>
                            <span>Gratis pendaftaran</span>
                        </div>
                        <div className="feature">
                            <span>🎁</span>
                            <span>Promo khusus member baru</span>
                        </div>
                        <div className="feature">
                            <span>🛍️</span>
                            <span>Bisa jadi pembeli & penjual</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="auth-form-card">
                        <h2>Daftar Akun</h2>
                        <p className="subtitle">Buat akun baru untuk mulai berbelanja</p>

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
                                        name="name"
                                        placeholder="Nama lengkap Anda"
                                        value={formData.name}
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
                                        placeholder="Minimal 8 karakter"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
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
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Ulangi password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <label className="checkbox-label terms-checkbox">
                                <input type="checkbox" required />
                                <span>
                                    Saya setuju dengan <Link href="/terms">Syarat & Ketentuan</Link> dan <Link href="/privacy">Kebijakan Privasi</Link>
                                </span>
                            </label>

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
          background: linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-700) 100%);
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
          color: var(--primary-300);
        }

        .logo-tang {
          opacity: 0.7;
          font-weight: 400;
        }

        .logo-pedia {
          color: white;
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
          border-color: var(--secondary-500);
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
          border-color: var(--secondary-500);
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .terms-checkbox {
          margin-bottom: var(--space-6);
        }

        .checkbox-label a {
          color: var(--secondary-600);
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%);
        }

        .submit-btn:hover {
          box-shadow: 0 6px 20px rgba(34, 197, 94, 0.35);
        }

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
          color: var(--secondary-600);
          font-weight: 600;
        }
      `}</style>
        </div>
    )
}
