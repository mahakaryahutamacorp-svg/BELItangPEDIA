'use client'

import Link from 'next/link'
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

const faqCategories = [
    {
        category: 'Pesanan & Pengiriman',
        questions: [
            {
                q: 'Bagaimana cara melacak pesanan saya?',
                a: 'Anda dapat melacak pesanan melalui menu "Pesanan Saya" di halaman profil. Klik pesanan yang ingin dilacak untuk melihat status terkini dan nomor resi pengiriman.'
            },
            {
                q: 'Berapa lama waktu pengiriman?',
                a: 'Pengiriman ke area Belitang dan sekitarnya biasanya memakan waktu 1-2 hari kerja. Untuk lokasi di luar area, waktu pengiriman menyesuaikan dengan kurir yang dipilih.'
            },
            {
                q: 'Apakah bisa COD (Bayar di Tempat)?',
                a: 'Ya, kami mendukung pembayaran COD untuk area Belitang dan sekitarnya. Bayar langsung ke kurir saat pesanan tiba.'
            },
            {
                q: 'Bagaimana jika pesanan saya tidak sampai?',
                a: 'Hubungi customer service kami melalui WhatsApp di 0812-3456-7890. Tim kami akan membantu melacak dan menyelesaikan masalah pengiriman Anda.'
            }
        ]
    },
    {
        category: 'Pembayaran',
        questions: [
            {
                q: 'Metode pembayaran apa saja yang tersedia?',
                a: 'Kami menerima pembayaran melalui Transfer Bank (BCA, BRI, Mandiri, BNI), E-Wallet (OVO, GoPay, Dana, ShopeePay), dan COD untuk area tertentu.'
            },
            {
                q: 'Bagaimana cara membatalkan pesanan?',
                a: 'Pesanan dapat dibatalkan selama belum diproses oleh penjual. Buka halaman pesanan, pilih pesanan yang ingin dibatalkan, lalu klik "Batalkan Pesanan".'
            },
            {
                q: 'Berapa lama proses refund?',
                a: 'Proses refund memakan waktu 3-7 hari kerja tergantung metode pembayaran yang digunakan. Dana akan dikembalikan ke saldo akun atau rekening Anda.'
            }
        ]
    },
    {
        category: 'Akun & Keamanan',
        questions: [
            {
                q: 'Bagaimana cara mendaftar?',
                a: 'Klik tombol "Daftar" di halaman utama, isi data diri Anda (nama, email, nomor HP), lalu verifikasi akun melalui email atau SMS.'
            },
            {
                q: 'Lupa password, bagaimana cara resetnya?',
                a: 'Di halaman login, klik "Lupa Password", masukkan email terdaftar, lalu ikuti instruksi yang dikirim ke email Anda untuk reset password.'
            },
            {
                q: 'Apakah data saya aman?',
                a: 'Ya, kami menggunakan enkripsi SSL dan sistem keamanan terbaru untuk melindungi data pribadi Anda. Baca Kebijakan Privasi kami untuk informasi lengkap.'
            }
        ]
    },
    {
        category: 'Seller',
        questions: [
            {
                q: 'Bagaimana cara menjadi seller?',
                a: 'Klik "Mulai Berjualan" di halaman utama, isi formulir pendaftaran, dan tunggu verifikasi dari tim kami dalam 1x24 jam.'
            },
            {
                q: 'Berapa biaya menjadi seller?',
                a: 'Pendaftaran GRATIS! Kami hanya mengenakan biaya 2% dari setiap transaksi berhasil. Tidak ada biaya bulanan atau tersembunyi.'
            },
            {
                q: 'Bagaimana cara menarik hasil penjualan?',
                a: 'Saldo penjualan dapat ditarik ke rekening bank Anda kapan saja melalui menu "Tarik Dana" di dashboard seller. Pencairan memakan waktu 1-2 hari kerja.'
            }
        ]
    }
]

export default function FAQPage() {
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({})

    const toggleItem = (key: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <Link href="/help" className="back-link">
                            <ArrowLeft size={20} />
                            <span>Pusat Bantuan</span>
                        </Link>
                    </div>

                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-icon">
                            <HelpCircle size={32} />
                        </div>
                        <div className="header-text">
                            <h1>FAQ</h1>
                            <p>Pertanyaan yang sering diajukan</p>
                        </div>
                    </div>

                    {/* FAQ List */}
                    {faqCategories.map((cat, catIdx) => (
                        <div key={catIdx} className="faq-category">
                            <h2>{cat.category}</h2>
                            <div className="faq-list">
                                {cat.questions.map((item, idx) => {
                                    const key = `${catIdx}-${idx}`
                                    const isExpanded = expandedItems[key]
                                    return (
                                        <div
                                            key={idx}
                                            className={`faq-item ${isExpanded ? 'expanded' : ''}`}
                                        >
                                            <button
                                                className="faq-question"
                                                onClick={() => toggleItem(key)}
                                            >
                                                <span>{item.q}</span>
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                            {isExpanded && (
                                                <div className="faq-answer">{item.a}</div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Contact CTA */}
                    <div className="contact-cta">
                        <p>Tidak menemukan jawaban yang Anda cari?</p>
                        <Link href="/help" className="btn btn-primary">
                            Hubungi Kami
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

        .faq-category {
          margin-bottom: var(--space-6);
        }

        .faq-category h2 {
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .faq-list {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .faq-item {
          border-bottom: 1px solid var(--border-light);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-primary);
          background: none;
        }

        .faq-question span {
          flex: 1;
          padding-right: var(--space-2);
        }

        .faq-answer {
          padding: 0 var(--space-4) var(--space-4);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .contact-cta {
          text-align: center;
          padding: var(--space-6);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .contact-cta p {
          margin-bottom: var(--space-4);
          color: var(--text-secondary);
        }
      `}</style>
        </>
    )
}
