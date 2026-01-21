'use client'

import Link from 'next/link'
import { ArrowLeft, Gift, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'

const vouchers = [
    {
        id: 1,
        code: 'BELITANG10',
        discount: '10%',
        minPurchase: 'Rp50.000',
        maxDiscount: 'Rp15.000',
        validUntil: '31 Jan 2026',
        color: 'primary'
    },
    {
        id: 2,
        code: 'HEMAT20K',
        discount: 'Rp20.000',
        minPurchase: 'Rp100.000',
        maxDiscount: 'Rp20.000',
        validUntil: '28 Jan 2026',
        color: 'secondary'
    },
    {
        id: 3,
        code: 'NEWUSER',
        discount: '25%',
        minPurchase: 'Rp30.000',
        maxDiscount: 'Rp25.000',
        validUntil: '15 Feb 2026',
        color: 'accent'
    },
    {
        id: 4,
        code: 'GRATISONGKIR',
        discount: 'Gratis Ongkir',
        minPurchase: 'Rp75.000',
        maxDiscount: 'Rp15.000',
        validUntil: '31 Jan 2026',
        color: 'green'
    }
]

export default function VoucherPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

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
                            <Gift size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Voucher Belanja</h1>
                            <p>Klaim voucher dan hemat lebih banyak!</p>
                        </div>
                    </div>

                    {/* Voucher List */}
                    <div className="voucher-list">
                        {vouchers.map((voucher) => (
                            <div key={voucher.id} className={`voucher-card ${voucher.color}`}>
                                <div className="voucher-left">
                                    <div className="voucher-discount">{voucher.discount}</div>
                                    <div className="voucher-min">Min. {voucher.minPurchase}</div>
                                </div>
                                <div className="voucher-right">
                                    <div className="voucher-code">
                                        <span>{voucher.code}</span>
                                        <button onClick={() => handleCopy(voucher.code)}>
                                            {copiedCode === voucher.code ? (
                                                <CheckCircle size={16} />
                                            ) : (
                                                <Copy size={16} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="voucher-info">
                                        <p>Maks. diskon {voucher.maxDiscount}</p>
                                        <p>Berlaku hingga {voucher.validUntil}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Terms */}
                    <div className="terms-section">
                        <h3>Syarat & Ketentuan Voucher</h3>
                        <ul>
                            <li>Voucher hanya berlaku untuk pembelian di BELItangPEDIA</li>
                            <li>Satu voucher hanya dapat digunakan satu kali per transaksi</li>
                            <li>Voucher tidak dapat digabung dengan promo lainnya</li>
                            <li>Voucher tidak dapat diuangkan</li>
                        </ul>
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
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
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

        .voucher-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .voucher-card {
          display: flex;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .voucher-left {
          padding: var(--space-4);
          min-width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .voucher-card.primary .voucher-left {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
        }

        .voucher-card.secondary .voucher-left {
          background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
        }

        .voucher-card.accent .voucher-left {
          background: linear-gradient(135deg, #F59E0B, #D97706);
        }

        .voucher-card.green .voucher-left {
          background: linear-gradient(135deg, #10B981, #059669);
        }

        .voucher-discount {
          font-size: var(--text-lg);
          font-weight: 800;
          text-align: center;
        }

        .voucher-min {
          font-size: var(--text-xs);
          opacity: 0.9;
          margin-top: 4px;
        }

        .voucher-right {
          flex: 1;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .voucher-code {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }

        .voucher-code span {
          font-family: monospace;
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text-primary);
          background: var(--gray-100);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
        }

        .voucher-code button {
          padding: var(--space-2);
          color: var(--primary-600);
        }

        .voucher-info p {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .terms-section {
          background: var(--bg-primary);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
        }

        .terms-section h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-3);
        }

        .terms-section ul {
          list-style: disc;
          padding-left: var(--space-4);
        }

        .terms-section li {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }
      `}</style>
        </>
    )
}
