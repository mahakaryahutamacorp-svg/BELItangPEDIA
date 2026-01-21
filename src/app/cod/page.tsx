'use client'

import Link from 'next/link'
import { ArrowLeft, CreditCard, CheckCircle, Banknote, Truck } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts } from '@/lib/mockData'

export default function CODPage() {
    const codProducts = mockProducts.slice(0, 12)

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
                            <CreditCard size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Bayar di Tempat (COD)</h1>
                            <p>Belanja aman, bayar saat barang sampai!</p>
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="how-it-works">
                        <h2>Cara Kerja COD</h2>
                        <div className="steps">
                            <div className="step">
                                <div className="step-icon">1</div>
                                <div className="step-content">
                                    <h3>Pilih Produk COD</h3>
                                    <p>Pilih produk dengan label COD</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-icon">2</div>
                                <div className="step-content">
                                    <h3>Checkout</h3>
                                    <p>Pilih metode pembayaran COD</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-icon">3</div>
                                <div className="step-content">
                                    <h3>Terima & Bayar</h3>
                                    <p>Bayar saat kurir tiba</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="benefits">
                        <div className="benefit">
                            <CheckCircle size={20} />
                            <span>Cek barang dulu, baru bayar</span>
                        </div>
                        <div className="benefit">
                            <Banknote size={20} />
                            <span>Bayar tunai ke kurir</span>
                        </div>
                        <div className="benefit">
                            <Truck size={20} />
                            <span>Gratis ongkir area Belitang</span>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <section className="products-section">
                        <h2 className="section-title">Produk COD</h2>
                        <div className="product-grid">
                            {codProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
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

        .how-it-works {
          background: var(--bg-primary);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-4);
        }

        .how-it-works h2 {
          font-size: var(--text-base);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .step {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .step-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--primary-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: var(--text-sm);
          flex-shrink: 0;
        }

        .step-content h3 {
          font-size: var(--text-sm);
          font-weight: 600;
        }

        .step-content p {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .benefits {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--secondary-100);
          color: var(--secondary-700);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 500;
        }

        .products-section {
          background: var(--bg-primary);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
        }

        .section-title {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        @media (min-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
        </>
    )
}
