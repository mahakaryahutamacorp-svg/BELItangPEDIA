'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

const guideSteps = [
    {
        title: 'Daftar Sebagai Seller',
        desc: 'Isi formulir pendaftaran dengan data toko dan diri Anda',
        steps: [
            'Klik tombol "Daftar Seller" di halaman utama',
            'Isi nama toko, nama pemilik, dan kontak',
            'Pilih kategori produk yang akan dijual',
            'Tunggu verifikasi dari tim kami (maks. 1x24 jam)'
        ]
    },
    {
        title: 'Verifikasi Akun',
        desc: 'Tim kami akan menghubungi Anda untuk verifikasi',
        steps: [
            'Siapkan KTP dan foto toko (jika ada)',
            'Tim kami akan menghubungi via WhatsApp',
            'Ikuti instruksi untuk verifikasi',
            'Akun seller Anda akan aktif setelah verifikasi'
        ]
    },
    {
        title: 'Tambah Produk',
        desc: 'Mulai menambahkan produk ke toko Anda',
        steps: [
            'Buka dashboard seller',
            'Klik "Tambah Produk"',
            'Isi detail produk: nama, harga, deskripsi, foto',
            'Klik "Simpan" untuk mempublikasikan produk'
        ]
    },
    {
        title: 'Kelola Pesanan',
        desc: 'Terima dan proses pesanan dari pembeli',
        steps: [
            'Notifikasi pesanan baru akan masuk ke HP Anda',
            'Cek detail pesanan di dashboard',
            'Konfirmasi dan siapkan pesanan',
            'Input nomor resi pengiriman'
        ]
    }
]

const tips = [
    'Gunakan foto produk yang jelas dan menarik',
    'Tulis deskripsi produk yang lengkap dan jujur',
    'Respon chat pembeli dengan cepat',
    'Pastikan stok produk selalu update',
    'Berikan pelayanan terbaik untuk mendapat review positif'
]

export default function SellerGuidePage() {
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
                            <BookOpen size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Panduan Seller</h1>
                            <p>Pelajari cara berjualan di BELItangPEDIA</p>
                        </div>
                    </div>

                    {/* Guide Steps */}
                    <section className="guide-section">
                        <h2>Langkah-langkah Berjualan</h2>
                        <div className="steps-list">
                            {guideSteps.map((step, idx) => (
                                <div key={idx} className="step-card">
                                    <div className="step-number">{idx + 1}</div>
                                    <div className="step-content">
                                        <h3>{step.title}</h3>
                                        <p>{step.desc}</p>
                                        <ul className="step-details">
                                            {step.steps.map((detail, i) => (
                                                <li key={i}>
                                                    <CheckCircle size={14} />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tips */}
                    <section className="guide-section">
                        <h2>Tips Sukses Berjualan</h2>
                        <div className="tips-card">
                            {tips.map((tip, idx) => (
                                <div key={idx} className="tip-item">
                                    <span className="tip-icon">💡</span>
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="cta-section">
                        <h3>Siap untuk mulai berjualan?</h3>
                        <Link href="/seller/register" className="btn btn-primary">
                            Daftar Sekarang
                            <ChevronRight size={18} />
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

        .guide-section {
          margin-bottom: var(--space-6);
        }

        .guide-section h2 {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .step-card {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: var(--primary-500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content h3 {
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-1);
        }

        .step-content p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin-bottom: var(--space-3);
        }

        .step-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .step-details li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .step-details li :global(svg) {
          color: var(--secondary-500);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tips-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
        }

        .tip-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--border-light);
          font-size: var(--text-sm);
        }

        .tip-item:last-child {
          border-bottom: none;
        }

        .tip-icon {
          font-size: 20px;
        }

        .cta-section {
          text-align: center;
          padding: var(--space-8);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .cta-section h3 {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }

        .cta-section :global(.btn) {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
        }
      `}</style>
        </>
    )
}
