'use client'

import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

export default function PrivacyPage() {
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
                            <Shield size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Kebijakan Privasi</h1>
                            <p>Terakhir diperbarui: 20 Januari 2026</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="content-card">
                        <section>
                            <h2>Pendahuluan</h2>
                            <p>
                                BELItangPEDIA berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
                            </p>
                        </section>

                        <section>
                            <h2>Informasi yang Kami Kumpulkan</h2>
                            <p>Kami mengumpulkan informasi berikut:</p>
                            <ul>
                                <li><strong>Data Identitas:</strong> Nama, email, nomor telepon, alamat</li>
                                <li><strong>Data Akun:</strong> Username, password (terenkripsi)</li>
                                <li><strong>Data Transaksi:</strong> Riwayat pembelian, metode pembayaran</li>
                                <li><strong>Data Perangkat:</strong> Jenis perangkat, sistem operasi, alamat IP</li>
                                <li><strong>Data Lokasi:</strong> Lokasi untuk pengiriman (opsional)</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Penggunaan Informasi</h2>
                            <p>Informasi Anda digunakan untuk:</p>
                            <ul>
                                <li>Memproses pesanan dan pengiriman</li>
                                <li>Komunikasi terkait layanan dan transaksi</li>
                                <li>Meningkatkan pengalaman pengguna</li>
                                <li>Mengirim promosi dan penawaran (dengan persetujuan)</li>
                                <li>Mencegah penipuan dan menjaga keamanan</li>
                                <li>Mematuhi kewajiban hukum</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Berbagi Informasi</h2>
                            <p>Kami tidak menjual data pribadi Anda. Kami hanya membagikan informasi dengan:</p>
                            <ul>
                                <li><strong>Penjual:</strong> Untuk memproses dan mengirim pesanan</li>
                                <li><strong>Mitra Logistik:</strong> Untuk pengiriman produk</li>
                                <li><strong>Penyedia Pembayaran:</strong> Untuk memproses transaksi</li>
                                <li><strong>Pihak Berwenang:</strong> Jika diwajibkan oleh hukum</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Keamanan Data</h2>
                            <p>
                                Kami menerapkan langkah-langkah keamanan untuk melindungi data Anda:
                            </p>
                            <ul>
                                <li>Enkripsi SSL untuk semua transmisi data</li>
                                <li>Penyimpanan password terenkripsi</li>
                                <li>Akses terbatas ke data pribadi</li>
                                <li>Monitoring keamanan 24/7</li>
                                <li>Backup data secara berkala</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Hak Anda</h2>
                            <p>Anda memiliki hak untuk:</p>
                            <ul>
                                <li>Mengakses data pribadi Anda</li>
                                <li>Memperbarui atau memperbaiki data</li>
                                <li>Menghapus akun dan data Anda</li>
                                <li>Menolak marketing email</li>
                                <li>Mengajukan keluhan ke otoritas terkait</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Cookie</h2>
                            <p>
                                Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Cookie membantu kami mengingat preferensi Anda dan menganalisis penggunaan situs. Anda dapat menonaktifkan cookie melalui pengaturan browser.
                            </p>
                        </section>

                        <section>
                            <h2>Penyimpanan Data</h2>
                            <p>
                                Data Anda disimpan selama akun aktif atau selama diperlukan untuk menyediakan layanan. Data transaksi disimpan sesuai kewajiban hukum (minimal 10 tahun untuk keperluan perpajakan).
                            </p>
                        </section>

                        <section>
                            <h2>Perubahan Kebijakan</h2>
                            <p>
                                Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di Platform.
                            </p>
                        </section>

                        <section>
                            <h2>Hubungi Kami</h2>
                            <p>
                                Untuk pertanyaan terkait privasi, hubungi:
                            </p>
                            <ul>
                                <li>Email: privacy@belitang.com</li>
                                <li>Telepon: 0812-3456-7890</li>
                                <li>Alamat: Belitang, OKU Timur, Sumatera Selatan</li>
                            </ul>
                        </section>
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
          max-width: 800px;
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
          background: linear-gradient(135deg, #3B82F6, #2563EB);
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

        .header-text p {
          font-size: var(--text-sm);
          opacity: 0.8;
        }

        .content-card {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
        }

        .content-card section {
          margin-bottom: var(--space-6);
        }

        .content-card section:last-child {
          margin-bottom: 0;
        }

        .content-card h2 {
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .content-card p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-3);
        }

        .content-card ul {
          list-style: disc;
          padding-left: var(--space-5);
        }

        .content-card li {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-2);
        }
      `}</style>
        </>
    )
}
