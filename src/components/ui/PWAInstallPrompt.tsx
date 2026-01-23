'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // Check if running in standalone mode (already installed)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) {
        setShowInstallBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false)
      setDeferredPrompt(null)
      console.log('PWA was installed')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallBanner(false)
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  // Don't show if already installed
  if (isStandalone) return null

  // Show iOS instructions
  if (isIOS && !isStandalone) {
    const iosDismissed = typeof window !== 'undefined' && localStorage.getItem('ios-install-dismissed')
    if (iosDismissed) return null

    return (
      <div className="pwa-install-banner ios">
        <div className="banner-content">
          <div className="banner-icon">📲</div>
          <div className="banner-text">
            <strong>Install BELItangPEDIA</strong>
            <span>Tap <strong>Share</strong> lalu <strong>&quot;Add to Home Screen&quot;</strong></span>
          </div>
          <button
            className="dismiss-btn"
            onClick={() => {
              localStorage.setItem('ios-install-dismissed', 'true')
              window.location.reload()
            }}
          >
            <X size={18} />
          </button>
        </div>

        <style jsx>{`
          .pwa-install-banner {
            position: fixed;
            bottom: 70px;
            left: 16px;
            right: 16px;
            background: linear-gradient(135deg, #047857, #059669);
            border-radius: 16px;
            padding: 16px;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .banner-content {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .banner-icon {
            font-size: 32px;
          }

          .banner-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
            color: white;
          }

          .banner-text strong {
            font-size: 14px;
          }

          .banner-text span {
            font-size: 12px;
            opacity: 0.9;
          }

          .dismiss-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
          }

          @media (min-width: 768px) {
            .pwa-install-banner {
              left: auto;
              right: 24px;
              max-width: 400px;
              bottom: 24px;
            }
          }
        `}</style>
      </div>
    )
  }

  // Show install banner for Android/Desktop
  if (!showInstallBanner) return null

  return (
    <div className="pwa-install-banner">
      <div className="banner-content">
        <div className="banner-icon">📱</div>
        <div className="banner-text">
          <strong>Install BELItangPEDIA</strong>
          <span>Akses lebih cepat dari home screen</span>
        </div>
        <button className="install-btn" onClick={handleInstallClick}>
          <Download size={16} />
          Install
        </button>
        <button className="dismiss-btn" onClick={handleDismiss}>
          <X size={18} />
        </button>
      </div>

      <style jsx>{`
        .pwa-install-banner {
          position: fixed;
          bottom: 70px;
          left: 16px;
          right: 16px;
          background: linear-gradient(135deg, #047857, #059669);
          border-radius: 16px;
          padding: 16px;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .banner-icon {
          font-size: 32px;
        }

        .banner-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          color: white;
        }

        .banner-text strong {
          font-size: 14px;
        }

        .banner-text span {
          font-size: 12px;
          opacity: 0.9;
        }

        .install-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          color: #047857;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .install-btn:hover {
          transform: scale(1.05);
        }

        .dismiss-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
        }

        @media (min-width: 768px) {
          .pwa-install-banner {
            left: auto;
            right: 24px;
            max-width: 400px;
            bottom: 24px;
          }
        }
      `}</style>
    </div>
  )
}
