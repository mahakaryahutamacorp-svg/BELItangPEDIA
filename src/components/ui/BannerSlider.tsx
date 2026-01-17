'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Banner } from '@/types'

interface BannerSliderProps {
    banners: Banner[]
    autoPlayInterval?: number
}

export default function BannerSlider({ banners, autoPlayInterval = 5000 }: BannerSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (banners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length)
        }, autoPlayInterval)

        return () => clearInterval(interval)
    }, [banners.length, autoPlayInterval])

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    if (banners.length === 0) return null

    return (
        <div className="banner-slider">
            <div
                className="slides-container"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="slide">
                        <img src={banner.image_url} alt={banner.title} />
                        <div className="slide-overlay">
                            <h2>{banner.title}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button className="nav-arrow prev" onClick={goToPrevious}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className="nav-arrow next" onClick={goToNext}>
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots */}
            {banners.length > 1 && (
                <div className="dots">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            )}

            <style jsx>{`
        .banner-slider {
          position: relative;
          width: 100%;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--gray-200);
        }

        .slides-container {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }

        .slide {
          min-width: 100%;
          position: relative;
          aspect-ratio: 21/9;
        }

        @media (max-width: 768px) {
          .slide {
            aspect-ratio: 16/9;
          }
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-8) var(--space-6);
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        }

        .slide-overlay h2 {
          color: white;
          font-size: var(--text-2xl);
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .slide-overlay h2 {
            font-size: var(--text-lg);
          }
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--radius-full);
          color: var(--text-primary);
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-fast);
          opacity: 0;
          cursor: pointer;
        }

        .banner-slider:hover .nav-arrow {
          opacity: 1;
        }

        .nav-arrow:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }

        .nav-arrow.prev {
          left: var(--space-4);
        }

        .nav-arrow.next {
          right: var(--space-4);
        }

        .dots {
          position: absolute;
          bottom: var(--space-4);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--space-2);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .dot.active {
          width: 24px;
          background: white;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }
      `}</style>
        </div>
    )
}
