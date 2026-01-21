'use client'

import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

export default function TermsPage() {
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
                            <FileText size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Syarat & Ketentuan</h1>
                            <p>Terakhir diperbarui: 20 Januari 2026</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="content-card">
                        <section>
                            <h2>1. Ketentuan Umum</h2>
                            <p>
                                Dengan mengakses dan menggunakan layanan BELItangPEDIA, Anda menyetujui untuk terikat dengan syarat dan ketentuan berikut. Jika Anda tidak menyetujui syarat dan ketentuan ini, harap tidak menggunakan layanan kami.
                            </p>
                        </section>

                        <section>
                            <h2>2. Definisi</h2>
                            <ul>
                                <li><strong>Platform:</strong> Situs web dan aplikasi BELItangPEDIA</li>
                                <li><strong>Pengguna:</strong> Individu yang mengakses atau menggunakan Platform</li>
                                <li><strong>Pembeli:</strong> Pengguna yang melakukan pembelian produk</li>
                                <li><strong>Penjual:</strong> Pengguna yang menjual produk di Platform</li>
                                <li><strong>Produk:</strong> Barang yang ditawarkan oleh Penjual</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. Pendaftaran Akun</h2>
                            <p>
                                Untuk menggunakan layanan secara penuh, Anda harus mendaftar akun dengan memberikan informasi yang akurat dan lengkap. Anda bertanggung jawab menjaga kerahasiaan akun dan password Anda.
                            </p>
                            <ul>
                                <li>Pengguna harus berusia minimal 17 tahun</li>
                                <li>Satu orang hanya boleh memiliki satu akun</li>
                                <li>Informasi yang diberikan harus valid dan dapat diverifikasi</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Transaksi</h2>
                            <p>
                                Setiap transaksi yang dilakukan melalui Platform tunduk pada ketentuan berikut:
                            </p>
                            <ul>
                                <li>Pembeli wajib melakukan pembayaran sesuai metode yang dipilih</li>
                                <li>Penjual wajib mengirimkan produk sesuai deskripsi</li>
                                <li>Platform berhak membatalkan transaksi mencurigakan</li>
                                <li>Sengketa akan diselesaikan sesuai prosedur yang berlaku</li>
                            </ul>
                        </section>

                        <section>
                            <h2>5. Pembatasan Penggunaan</h2>
                            <p>Pengguna dilarang:</p>
                            <ul>
                                <li>Menjual produk ilegal, berbahaya, atau melanggar hukum</li>
                                <li>Melakukan penipuan atau manipulasi harga</li>
                                <li>Menggunakan Platform untuk aktivitas ilegal</li>
                                <li>Mengganggu sistem keamanan Platform</li>
                                <li>Membuat akun palsu atau menyamar sebagai pihak lain</li>
                            </ul>
                        </section>

                        <section>
                            <h2>6. Hak Kekayaan Intelektual</h2>
                            <p>
                                Seluruh konten di Platform, termasuk logo, desain, dan teks, adalah milik BELItangPEDIA dan dilindungi oleh hukum hak cipta Indonesia.
                            </p>
                        </section>

                        <section>
                            <h2>7. Pembatasan Tanggung Jawab</h2>
                            <p>
                                BELItangPEDIA tidak bertanggung jawab atas kerugian yang timbul dari penggunaan Platform, termasuk namun tidak terbatas pada kerusakan produk, keterlambatan pengiriman, atau sengketa antar pengguna.
                            </p>
                        </section>

                        <section>
                            <h2>8. Perubahan Ketentuan</h2>
                            <p>
                                Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif setelah dipublikasikan di Platform.
                            </p>
                        </section>

                        <section>
                            <h2>9. Hukum yang Berlaku</h2>
                            <p>
                                Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Sengketa akan diselesaikan melalui musyawarah atau lembaga yang berwenang.
                            </p>
                        </section>

                        <section>
                            <h2>10. Kontak</h2>
                            <p>
                                Untuk pertanyaan terkait syarat dan ketentuan ini, hubungi:
                            </p>
                            <ul>
                                <li>Email: legal@belitang.com</li>
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
          background: linear-gradient(135deg, var(--gray-700), var(--gray-800));
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
