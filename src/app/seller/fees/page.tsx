'use client'

import Link from 'next/link'
import { ArrowLeft, DollarSign, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

const fees = [
  {
    name: 'Biaya Platform',
    percent: '2%',
    desc: 'Per transaksi berhasil',
    included: true
  },
  {
    name: 'Biaya Payment Gateway',
    percent: '1%',
    desc: 'Untuk pembayaran digital',
    included: true
  },
  {
    name: 'Biaya Pendaftaran',
    percent: 'Rp0',
    desc: 'GRATIS selamanya!',
    included: false
  },
  {
    name: 'Biaya Bulanan',
    percent: 'Rp0',
    desc: 'Tidak ada biaya langganan',
    included: false
  }
]

const comparison = [
  { feature: 'Pendaftaran Gratis', us: true, others: false },
  { feature: 'Biaya Platform Rendah', us: true, others: false },
  { feature: 'Tanpa Biaya Bulanan', us: true, others: false },
  { feature: 'COD Gratis', us: true, others: false },
  { feature: 'Support 24/7', us: true, others: true },
  { feature: 'Pengiriman Lokal Cepat', us: true, others: false },
]

export default function SellerFeesPage() {
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
              <DollarSign size={32} />
            </div>
            <div className="header-text">
              <h1>Biaya Layanan</h1>
              <p>Transparan dan terjangkau</p>
            </div>
          </div>

          {/* Fees List */}
          <section className="fees-section">
            <h2>Rincian Biaya</h2>
            <div className="fees-list">
              {fees.map((fee, idx) => (
                <div key={idx} className={`fee-card ${!fee.included ? 'free' : ''}`}>
                  <div className="fee-info">
                    <h3>{fee.name}</h3>
                    <p>{fee.desc}</p>
                  </div>
                  <div className="fee-amount">
                    {fee.percent}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Calculation Example */}
          <section className="fees-section">
            <h2>Contoh Perhitungan</h2>
            <div className="calc-card">
              <div className="calc-row">
                <span>Harga Produk</span>
                <span>Rp100.000</span>
              </div>
              <div className="calc-row">
                <span>Biaya Platform (2%)</span>
                <span className="red">-Rp2.000</span>
              </div>
              <div className="calc-row">
                <span>Biaya Payment (1%)</span>
                <span className="red">-Rp1.000</span>
              </div>
              <div className="calc-divider" />
              <div className="calc-row total">
                <span>Yang Anda Terima</span>
                <span className="green">Rp97.000</span>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section className="fees-section">
            <h2>Perbandingan dengan Platform Lain</h2>
            <div className="comparison-table">
              <div className="table-header">
                <span></span>
                <span>BELItangPEDIA</span>
                <span>Lainnya</span>
              </div>
              {comparison.map((item, idx) => (
                <div key={idx} className="table-row">
                  <span>{item.feature}</span>
                  <span className="icon">
                    {item.us ? (
                      <CheckCircle size={18} className="check" />
                    ) : (
                      <XCircle size={18} className="x" />
                    )}
                  </span>
                  <span className="icon">
                    {item.others ? (
                      <CheckCircle size={18} className="check" />
                    ) : (
                      <XCircle size={18} className="x" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="cta-section">
            <h3>Mulai Berjualan Tanpa Modal!</h3>
            <p>Daftar gratis, mulai jualan hari ini</p>
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
          background: linear-gradient(135deg, #10B981, #059669);
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

        .fees-section {
          margin-bottom: var(--space-6);
        }

        .fees-section h2 {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }

        .fees-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .fee-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .fee-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .fee-card.free {
          border: 2px solid var(--secondary-500);
          background: var(--secondary-50);
        }

        .fee-info h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: 2px;
        }

        .fee-info p {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .fee-amount {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--primary-600);
        }

        .fee-card.free .fee-amount {
          color: var(--secondary-600);
        }

        .calc-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
        }

        .calc-row {
          display: flex;
          justify-content: space-between;
          padding: var(--space-2) 0;
          font-size: var(--text-sm);
        }

        .calc-row.total {
          font-weight: 700;
        }

        .calc-row .red {
          color: var(--accent-red);
        }

        .calc-row .green {
          color: var(--secondary-600);
          font-size: var(--text-lg);
        }

        .calc-divider {
          height: 1px;
          background: var(--border-light);
          margin: var(--space-2) 0;
        }

        .comparison-table {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          padding: var(--space-3) var(--space-4);
        }

        .table-header {
          background: var(--gray-100);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-tertiary);
          text-align: center;
        }

        .table-header span:first-child {
          text-align: left;
        }

        .table-row {
          border-bottom: 1px solid var(--border-light);
          font-size: var(--text-sm);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row .icon {
          text-align: center;
        }

        .table-row :global(.check) {
          color: var(--secondary-500);
        }

        .table-row :global(.x) {
          color: var(--gray-300);
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
          margin-bottom: var(--space-2);
        }

        .cta-section p {
          color: var(--text-tertiary);
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
