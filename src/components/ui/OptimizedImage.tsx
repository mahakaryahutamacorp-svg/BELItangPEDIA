'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
    src: string | null | undefined
    alt: string
    width?: number
    height?: number
    fill?: boolean
    className?: string
    priority?: boolean
    sizes?: string
    placeholder?: 'blur' | 'empty'
    fallbackSrc?: string
}

/**
 * Optimized Image component with fallback and error handling
 * Uses Next.js Image for automatic optimization (WebP/AVIF, lazy loading, etc.)
 */
export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    fill = false,
    className = '',
    priority = false,
    sizes,
    placeholder = 'empty',
    fallbackSrc = '/placeholder.svg',
}: OptimizedImageProps) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
    const [hasError, setHasError] = useState(false)

    const handleError = () => {
        if (!hasError) {
            setHasError(true)
            setImgSrc(fallbackSrc)
        }
    }

    // If no src provided, show fallback
    if (!src) {
        if (fill) {
            return (
                <Image
                    src={fallbackSrc}
                    alt={alt}
                    fill
                    className={className}
                    style={{ objectFit: 'cover' }}
                />
            )
        }
        return (
            <Image
                src={fallbackSrc}
                alt={alt}
                width={width || 100}
                height={height || 100}
                className={className}
            />
        )
    }

    // Handle data URLs and blob URLs (for previews)
    if (src.startsWith('data:') || src.startsWith('blob:')) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} className={className} style={{ objectFit: 'cover' }} />
    }

    if (fill) {
        return (
            <Image
                src={imgSrc}
                alt={alt}
                fill
                className={className}
                style={{ objectFit: 'cover' }}
                priority={priority}
                sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
                onError={handleError}
            />
        )
    }

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={width || 100}
            height={height || 100}
            className={className}
            priority={priority}
            sizes={sizes}
            onError={handleError}
        />
    )
}
