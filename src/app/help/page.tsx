'use client'

import Link from 'next/link'
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

const helpCategories = [
    { icon: '📦', title: 'Pesanan', desc: 'Lacak, ubah, atau batalkan pesanan' },
    { icon: '🚚', title: 'Pengiriman', desc: 'Info ongkir dan estimasi pengiriman' },
    { icon: '💳', title: 'Pembayaran', desc: 'Metode pembayaran dan refund' },
    { icon: '↩️', title: 'Pengembalian', desc: 'Proses retur dan pengembalian dana' },
    { icon: '👤', title: 'Akun', desc: 'Pengaturan akun dan keamanan' },
    { icon: '🏪', title: 'Seller', desc: 'Bantuan untuk penjual' },
]

const faqItems = [
    {
        question: 'Bagaimana cara melacak pesanan saya?',
        answer: 'Anda dapat melacak pesanan melalui menu "Pesanan Saya" di halaman profil. Klik pesanan yang ingin dilacak untuk melihat status terkini.'
    },
    {
        question: 'Berapa lama waktu pengiriman ke Belitang?',
        answer: 'Pengiriman ke area Belitang dan sekitarnya biasanya memakan waktu 1-2 hari kerja. Untuk pesanan COD, pengiriman bisa lebih cepat.'
    },
    {
        question: 'Bagaimana cara mendapatkan gratis ongkir?',
        answer: 'Gratis ongkir otomatis berlaku untuk pembelian minimal Rp50.000 ke area Belitang. Pastikan alamat pengiriman Anda sudah benar.'
    },
]

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
                        <div className="header-icon">
                            <HelpCircle size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Pusat Bantuan</h1>
                            <p>Ada yang bisa kami bantu?</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="help-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Cari pertanyaan atau topik..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Categories */}
                    <section className="help-section">
                        <h2>Pilih Topik</h2>
                        <div className="categories-grid">
                            {helpCategories.map((cat) => (
                                <div key={cat.title} className="category-card">
                                    <span className="cat-icon">{cat.icon}</span>
                                    <h3>{cat.title}</h3>
                                    <p>{cat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="help-section">
                        <h2>Pertanyaan Umum</h2>
                        <div className="faq-list">
                            {faqItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`faq-item ${expandedFaq === idx ? 'expanded' : ''}`}
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                >
                                    <div className="faq-question">
                                        <span>{item.question}</span>
                                        <ChevronRight size={18} />
                                    </div>
                                    {expandedFaq === idx && (
                                        <div className="faq-answer">{item.answer}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Link href="/faq" className="see-more">
                            Lihat Semua FAQ
                            <ChevronRight size={16} />
                        </Link>
                    </section>

                    {/* Contact */}
                    <section className="help-section contact">
                        <h2>Hubungi Kami</h2>
                        <div className="contact-options">
                            <a href="https://wa.me/6281234567890" className="contact-card whatsapp">
                                <MessageCircle size={24} />
                                <div>
                                    <h3>WhatsApp</h3>
                                    <p>Chat langsung dengan CS</p>
                                </div>
                            </a>
                            <a href="tel:081234567890" className="contact-card phone">
                                <Phone size={24} />
                                <div>
                                    <h3>Telepon</h3>
                                    <p>0812-3456-7890</p>
                                </div>
                            </a>
                            <a href="mailto:hello@belitang.com" className="contact-card email">
                                <Mail size={24} />
                                <div>
                                    <h3>Email</h3>
                                    <p>hello@belitang.com</p>
                                </div>
                            </a>
                        </div>
                    </section>
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
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          padding: var(--space-6);
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
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
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .help-search {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-6);
        }

        .help-search svg {
          color: var(--text-tertiary);
        }

        .help-search input {
          flex: 1;
          border: none;
          background: none;
          font-size: var(--text-sm);
          outline: none;
        }

        .help-section {
          margin-bottom: var(--space-6);
        }

        .help-section h2 {
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        @media (min-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .category-card {
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .category-card:hover {
          box-shadow: var(--shadow-md);
        }

        .cat-icon {
          font-size: 28px;
          display: block;
          margin-bottom: var(--space-2);
        }

        .category-card h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: 4px;
        }

        .category-card p {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .faq-list {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .faq-item {
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-light);
          cursor: pointer;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .faq-item.expanded .faq-question svg {
          transform: rotate(90deg);
        }

        .faq-answer {
          margin-top: var(--space-3);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .see-more {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: var(--space-3);
          font-size: var(--text-sm);
          color: var(--primary-600);
          font-weight: 500;
        }

        .contact-options {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          color: white;
        }

        .contact-card.whatsapp {
          background: #25D366;
        }

        .contact-card.phone {
          background: var(--primary-500);
        }

        .contact-card.email {
          background: var(--secondary-500);
        }

        .contact-card h3 {
          font-size: var(--text-sm);
          font-weight: 600;
        }

        .contact-card p {
          font-size: var(--text-xs);
          opacity: 0.9;
        }
      `}</style>
        </>
    )
}
