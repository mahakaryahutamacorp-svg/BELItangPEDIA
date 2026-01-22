'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, ArrowRight } from 'lucide-react'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Dapatkan Promo Menarik!</h3>
              <p>Daftar newsletter untuk info promo dan produk terbaru</p>
            </div>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                required
              />
              <button type="submit" className="btn btn-primary">
                <span className="hide-mobile">Berlangganan</span>
                <ArrowRight size={18} className="show-mobile" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <span className="logo-icon">🛒</span>
                <span className="logo-text">
                  <span className="logo-beli">BELI</span>
                  <span className="logo-tang">tang</span>
                  <span className="logo-pedia">PEDIA</span>
                </span>
              </Link>
              <p className="footer-tagline">
                Marketplace lokal untuk masyarakat Belitang dan sekitarnya. Dukung UMKM lokal, belanja cepat sampai!
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link whatsapp" aria-label="WhatsApp">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links">
              <h4>Jelajahi</h4>
              <ul>
                <li><Link href="/products">Semua Produk</Link></li>
                <li><Link href="/categories">Kategori</Link></li>
                <li><Link href="/flash-sale">Flash Sale</Link></li>
                <li><Link href="/stores">Toko Terdekat</Link></li>
              </ul>
            </div>

            {/* Seller */}
            <div className="footer-links">
              <h4>Seller</h4>
              <ul>
                <li><Link href="/seller">Mulai Berjualan</Link></li>
                <li><Link href="/seller/register">Daftar Seller</Link></li>
                <li><Link href="/seller/guide">Panduan Seller</Link></li>
                <li><Link href="/seller/fees">Biaya Layanan</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div className="footer-links">
              <h4>Bantuan</h4>
              <ul>
                <li><Link href="/help">Pusat Bantuan</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/terms">Syarat & Ketentuan</Link></li>
                <li><Link href="/privacy">Kebijakan Privasi</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-contact">
              <h4>Hubungi Kami</h4>
              <ul>
                <li>
                  <MapPin size={16} />
                  <span>Belitang, OKU Timur<br />Sumatera Selatan</span>
                </li>
                <li>
                  <Phone size={16} />
                  <span>0812-3456-7890</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>hello@belitang.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <p>© {currentYear} BELItangPEDIA. Semua hak dilindungi.</p>
          <div className="payment-methods">
            <span>💳</span>
            <span>💵</span>
            <span>🏦</span>
          </div>
        </div>
      </div>

      <style jsx>{`
                .footer {
                    background: var(--gray-900);
                    color: var(--gray-300);
                    margin-top: auto;
                }

                .newsletter-section {
                    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
                    padding: var(--space-8) 0;
                }

                .newsletter-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .newsletter-content {
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        text-align: left;
                    }
                }

                .newsletter-text h3 {
                    font-family: var(--font-display);
                    font-size: var(--text-xl);
                    font-weight: 700;
                    color: white;
                    margin-bottom: var(--space-1);
                }

                .newsletter-text p {
                    color: var(--primary-100);
                    font-size: var(--text-sm);
                }

                .newsletter-form {
                    display: flex;
                    gap: var(--space-2);
                    width: 100%;
                    max-width: 400px;
                }

                @media (min-width: 768px) {
                    .newsletter-form {
                        width: auto;
                    }
                }

                .newsletter-form input {
                    flex: 1;
                    padding: var(--space-3) var(--space-4);
                    border: none;
                    border-radius: var(--radius-xl);
                    font-size: var(--text-sm);
                    background: white;
                }

                .newsletter-form input:focus {
                    outline: 2px solid var(--primary-300);
                }

                .newsletter-form .btn {
                    flex-shrink: 0;
                }

                .footer-main {
                    padding: var(--space-12) 0;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--space-8);
                }

                @media (min-width: 640px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .footer-grid {
                        grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
                        gap: var(--space-10);
                    }
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    margin-bottom: var(--space-4);
                }

                .logo-icon {
                    font-size: 36px;
                }

                .logo-text {
                    font-family: var(--font-display);
                    font-weight: 800;
                    font-size: var(--text-xl);
                }

                .logo-beli {
                    color: var(--primary-400);
                }

                .logo-tang {
                    color: var(--gray-400);
                    font-weight: 400;
                }

                .logo-pedia {
                    color: var(--secondary-400);
                }

                .footer-tagline {
                    font-size: var(--text-sm);
                    line-height: 1.7;
                    margin-bottom: var(--space-6);
                    color: var(--gray-400);
                }

                .footer-social {
                    display: flex;
                    gap: var(--space-3);
                }

                .social-link {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--gray-800);
                    border-radius: var(--radius-lg);
                    color: var(--gray-400);
                    transition: all var(--transition-fast);
                }

                .social-link:hover {
                    background: var(--primary-600);
                    color: white;
                    transform: translateY(-2px);
                }

                .social-link.whatsapp:hover {
                    background: #25D366;
                }

                .footer-links h4,
                .footer-contact h4 {
                    font-size: var(--text-sm);
                    font-weight: 600;
                    color: white;
                    margin-bottom: var(--space-4);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .footer-links ul {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .footer-links a {
                    font-size: var(--text-sm);
                    color: var(--gray-400);
                    transition: color var(--transition-fast);
                }

                .footer-links a:hover {
                    color: var(--primary-400);
                }

                .footer-contact ul {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .footer-contact li {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-3);
                    font-size: var(--text-sm);
                    color: var(--gray-400);
                }

                .footer-contact li svg {
                    flex-shrink: 0;
                    margin-top: 2px;
                    color: var(--primary-500);
                }

                .footer-bottom {
                    border-top: 1px solid var(--gray-800);
                    padding: var(--space-6) 0;
                }

                .footer-bottom .container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    align-items: center;
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .footer-bottom .container {
                        flex-direction: row;
                        justify-content: space-between;
                    }
                }

                .footer-bottom p {
                    font-size: var(--text-sm);
                    color: var(--gray-500);
                }

                .payment-methods {
                    display: flex;
                    gap: var(--space-2);
                    font-size: 24px;
                }

                .hide-mobile {
                    display: none;
                }

                .show-mobile {
                    display: block;
                }

                @media (min-width: 768px) {
                    .hide-mobile {
                        display: block;
                    }
                    .show-mobile {
                        display: none;
                    }
                }
            `}</style>
    </footer>
  )
}
