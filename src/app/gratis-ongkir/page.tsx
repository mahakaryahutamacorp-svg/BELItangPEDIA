'use client'

import Link from 'next/link'
import { ArrowLeft, Truck, CheckCircle, MapPin } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts } from '@/lib/mockData'

export default function GratisOngkirPage() {
    const freeShippingProducts = mockProducts.slice(0, 12)

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
                            <Truck size={32} />
                        </div>
                        <div className="header-text">
                            <h1>Gratis Ongkir</h1>
                            <p>Belanja tanpa khawatir ongkos kirim! Gratis ongkir ke seluruh Belitang.</p>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="info-cards">
                        <div className="info-card">
                            <CheckCircle size={20} />
                            <div>
                                <h3>Min. Belanja Rp50.000</h3>
                                <p>Gratis ongkir untuk pembelian minimal</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <MapPin size={20} />
                            <div>
                                <h3>Area Belitang & Sekitar</h3>
                                <p>Pengiriman cepat 1-2 hari</p>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <section className="products-section">
                        <h2 className="section-title">Produk Gratis Ongkir</h2>
                        <div className="product-grid">
                            {freeShippingProducts.map((product) => (
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

        .header-text p {
          opacity: 0.9;
          font-size: var(--text-sm);
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          color: var(--text-primary);
        }

        .info-card svg {
          color: var(--secondary-600);
          flex-shrink: 0;
        }

        .info-card h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: 2px;
        }

        .info-card p {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
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
