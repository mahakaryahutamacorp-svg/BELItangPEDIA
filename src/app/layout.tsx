import type { Metadata } from 'next'
import '@/styles/globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'

export const metadata: Metadata = {
    title: 'BELItangPEDIA - Marketplace Lokal Belitang',
    description: 'Marketplace lokal untuk masyarakat Belitang dan sekitarnya. Dukung UMKM lokal, belanja cepat sampai! Pengiriman instan, pembayaran COD.',
    keywords: ['belitang', 'marketplace', 'UMKM', 'toko online', 'belanja online', 'OKU Timur', 'belitangpedia', 'marketplace belitang'],
    authors: [{ name: 'BELItangPEDIA' }],
    creator: 'BELItangPEDIA',
    publisher: 'BELItangPEDIA',
    icons: {
        icon: '/logo.png',
        apple: '/logo.png',
    },
    openGraph: {
        title: 'BELItangPEDIA - Marketplace Lokal Belitang',
        description: 'Marketplace lokal untuk masyarakat Belitang dan sekitarnya. Dukung UMKM lokal, belanja cepat sampai! Pengiriman instan, pembayaran COD.',
        type: 'website',
        locale: 'id_ID',
        siteName: 'BELItangPEDIA',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'BELItangPEDIA - Marketplace Lokal Belitang',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BELItangPEDIA - Marketplace Lokal Belitang',
        description: 'Marketplace lokal untuk masyarakat Belitang dan sekitarnya. Dukung UMKM lokal, belanja cepat sampai!',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
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
                {/* PWA Meta Tags */}
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#047857" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="BELItangPEDIA" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="application-name" content="BELItangPEDIA" />
                <meta name="msapplication-TileColor" content="#047857" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="format-detection" content="telephone=no" />

                {/* Apple Touch Icons */}
                <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <AuthProvider>
                    {children}
                    <PWAInstallPrompt />
                </AuthProvider>
            </body>
        </html>
    )
}
