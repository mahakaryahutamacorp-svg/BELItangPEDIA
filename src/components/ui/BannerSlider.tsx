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
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % banners.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [banners.length, isTransitioning])

  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [banners.length, isTransitioning])

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Auto play
  useEffect(() => {
    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [goToNext, autoPlayInterval])

  if (!banners.length) return null

  return (
    <div className="banner-slider">
      <div className="banner-container">
        {banners.map((banner, index) => (
          <Link
            href={banner.link || '#'}
            key={banner.id}
            className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img
              src={banner.image_url}
              alt={banner.title}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="banner-overlay">
              <div className="banner-content">
                <h2 className="banner-title">{banner.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="banner-nav banner-nav-prev"
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        className="banner-nav banner-nav-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="banner-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
                .banner-slider {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 0;
                }

                @media (min-width: 768px) {
                    .banner-slider {
                        border-radius: var(--radius-2xl);
                        margin: var(--space-4) auto;
                        max-width: calc(100% - var(--space-12));
                    }
                }

                .banner-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 2/1;
                }

                @media (min-width: 768px) {
                    .banner-container {
                        aspect-ratio: 21/9;
                    }
                }

                @media (min-width: 1200px) {
                    .banner-container {
                        aspect-ratio: 3/1;
                    }
                }

                .banner-slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    visibility: hidden;
                    transform: scale(1.05);
                    transition: all 0.6s ease;
                    pointer-events: none;
                }

                .banner-slide.active {
                    opacity: 1;
                    visibility: visible;
                    transform: scale(1);
                    pointer-events: auto;
                }

                .banner-slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .banner-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to right,
                        rgba(0, 0, 0, 0.6) 0%,
                        rgba(0, 0, 0, 0.3) 50%,
                        transparent 100%
                    );
                    display: flex;
                    align-items: flex-end;
                    padding: var(--space-6);
                }

                @media (min-width: 768px) {
                    .banner-overlay {
                        align-items: center;
                        padding: var(--space-12);
                    }
                }

                .banner-content {
                    max-width: 500px;
                }

                .banner-title {
                    font-family: var(--font-display);
                    font-size: var(--text-xl);
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    line-height: 1.3;
                }

                @media (min-width: 768px) {
                    .banner-title {
                        font-size: var(--text-3xl);
                    }
                }

                @media (min-width: 1024px) {
                    .banner-title {
                        font-size: var(--text-4xl);
                    }
                }

                .banner-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(4px);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-primary);
                    box-shadow: var(--shadow-lg);
                    transition: all var(--transition-fast);
                    opacity: 0;
                    z-index: 10;
                }

                .banner-slider:hover .banner-nav {
                    opacity: 1;
                }

                .banner-nav:hover {
                    background: white;
                    transform: translateY(-50%) scale(1.1);
                }

                .banner-nav-prev {
                    left: var(--space-4);
                }

                .banner-nav-next {
                    right: var(--space-4);
                }

                .banner-dots {
                    position: absolute;
                    bottom: var(--space-4);
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: var(--space-2);
                    z-index: 10;
                }

                .banner-dot {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: var(--radius-full);
                    transition: all var(--transition-fast);
                    cursor: pointer;
                }

                .banner-dot:hover {
                    background: rgba(255, 255, 255, 0.8);
                }

                .banner-dot.active {
                    width: 24px;
                    background: white;
                }

                @media (max-width: 768px) {
                    .banner-nav {
                        width: 36px;
                        height: 36px;
                        opacity: 1;
                    }
                    .banner-nav-prev {
                        left: var(--space-2);
                    }
                    .banner-nav-next {
                        right: var(--space-2);
                    }
                }
            `}</style>
    </div>
  )
}
