'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Banner } from '@/types'

interface BannerSliderProps {
  banners: Banner[]
  autoPlayInterval?: number
}

export default function BannerSlider({
  banners,
  autoPlayInterval = 3000
}: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto play
  useEffect(() => {
    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [goToNext, autoPlayInterval])

  if (!banners.length) return null

  const currentBanner = banners[currentIndex]

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Single Banner Display */}
      <Link
        href={currentBanner.link || '#'}
        style={{
          display: 'block',
          position: 'relative',
          width: '100%',
          aspectRatio: '2/1'
        }}
      >
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {currentBanner.title}
          </h2>
        </div>
      </Link>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); goToPrev(); }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '8px',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
      >
        <ChevronLeft size={20} color="#333" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); goToNext(); }}
        style={{
          position: 'absolute',
          top: '50%',
          right: '8px',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
      >
        <ChevronRight size={20} color="#333" />
      </button>

      {/* Dots */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentIndex ? '24px' : '8px',
              height: '8px',
              background: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  )
}
