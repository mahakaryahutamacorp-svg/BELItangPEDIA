import Link from 'next/link'
import {
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin
} from 'lucide-react'

export default function Footer() {
    return (
        <footer className="footer">
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
                            Marketplace lokal untuk masyarakat Belitang dan sekitarnya.
                            Dukung UMKM lokal, belanja cepat sampai!
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4>Belanja</h4>
                        <ul>
                            <li><Link href="/products">Semua Produk</Link></li>
                            <li><Link href="/flash-sale">Flash Sale</Link></li>
                            <li><Link href="/stores">Toko Terdekat</Link></li>
                            <li><Link href="/category/makanan">Makanan</Link></li>
                            <li><Link href="/category/elektronik">Elektronik</Link></li>
                        </ul>
                    </div>

                    {/* Seller */}
                    <div className="footer-section">
                        <h4>Jual di BELItangPEDIA</h4>
                        <ul>
                            <li><Link href="/seller/register">Daftar Jadi Penjual</Link></li>
                            <li><Link href="/seller">Seller Center</Link></li>
                            <li><Link href="/help/seller">Panduan Berjualan</Link></li>
                            <li><Link href="/help/shipping">Pengiriman Lokal</Link></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="footer-section">
                        <h4>Bantuan</h4>
                        <ul>
                            <li><Link href="/help">Pusat Bantuan</Link></li>
                            <li><Link href="/help/order">Cara Pesan</Link></li>
                            <li><Link href="/help/payment">Pembayaran COD</Link></li>
                            <li><Link href="/help/return">Pengembalian</Link></li>
                            <li><Link href="/contact">Hubungi Kami</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h4>Hubungi Kami</h4>
                        <ul className="footer-contact">
                            <li>
                                <MapPin size={16} />
                                <span>Belitang, OKU Timur, Sumatera Selatan</span>
                            </li>
                            <li>
                                <Phone size={16} />
                                <span>0812-3456-7890</span>
                            </li>
                            <li>
                                <Mail size={16} />
                                <span>halo@belitangpedia.id</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>&copy; 2024 BELItangPEDIA. Hak Cipta Dilindungi.</p>
                    </div>
                    <div className="footer-links">
                        <Link href="/terms">Syarat & Ketentuan</Link>
                        <Link href="/privacy">Kebijakan Privasi</Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .footer {
          background: var(--gray-900);
          color: var(--gray-300);
          padding: var(--space-16) 0 var(--space-8);
          margin-top: var(--space-16);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          }
        }

        .footer-brand {
          max-width: 300px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .logo-icon {
          font-size: 32px;
        }

        .logo-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: var(--text-xl);
        }

        .logo-beli {
          color: var(--primary-500);
        }

        .logo-tang {
          color: var(--gray-400);
          font-weight: 400;
        }

        .logo-pedia {
          color: var(--secondary-500);
        }

        .footer-tagline {
          font-size: var(--text-sm);
          line-height: 1.6;
          margin-bottom: var(--space-4);
        }

        .footer-social {
          display: flex;
          gap: var(--space-3);
        }

        .footer-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--gray-800);
          border-radius: var(--radius-md);
          color: var(--gray-400);
          transition: all var(--transition-fast);
        }

        .footer-social a:hover {
          background: var(--primary-600);
          color: white;
        }

        .footer-section h4 {
          color: white;
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section li {
          margin-bottom: var(--space-2);
        }

        .footer-section a {
          color: var(--gray-400);
          font-size: var(--text-sm);
          transition: color var(--transition-fast);
        }

        .footer-section a:hover {
          color: var(--primary-500);
        }

        .footer-contact li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-sm);
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding-top: var(--space-8);
          margin-top: var(--space-8);
          border-top: 1px solid var(--gray-800);
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .footer-copyright p {
          font-size: var(--text-sm);
          color: var(--gray-500);
        }

        .footer-links {
          display: flex;
          gap: var(--space-6);
        }

        .footer-links a {
          font-size: var(--text-sm);
          color: var(--gray-500);
        }

        .footer-links a:hover {
          color: var(--primary-500);
        }
      `}</style>
        </footer>
    )
}
