import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
    title: 'BELItangPEDIA - Marketplace Lokal Belitang',
    description: 'Marketplace lokal untuk masyarakat Belitang dan sekitarnya. Dukung UMKM lokal, belanja cepat sampai! Pengiriman instan, pembayaran COD.',
    keywords: ['belitang', 'marketplace', 'UMKM', 'toko online', 'belanja online', 'OKU Timur'],
    openGraph: {
        title: 'BELItangPEDIA - Marketplace Lokal Belitang',
        description: 'Dukung UMKM lokal, belanja cepat sampai!',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}
