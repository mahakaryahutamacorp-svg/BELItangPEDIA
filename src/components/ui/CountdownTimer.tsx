'use client'

import { useState, useEffect, useCallback } from 'react'

interface CountdownTimerProps {
  targetDate: Date
  onComplete?: () => void
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime()

    if (difference <= 0) {
      if (onComplete) onComplete()
      return { hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }, [targetDate, onComplete])

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  if (!mounted) {
    return (
      <div className="countdown-timer">
        <div className="countdown-item">
          <span className="countdown-value">--</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-item">
          <span className="countdown-value">--</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-item">
          <span className="countdown-value">--</span>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="countdown-timer">
      <div className="countdown-item">
        <span className="countdown-value">{formatNumber(timeLeft.hours)}</span>
        <span className="countdown-label">Jam</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{formatNumber(timeLeft.minutes)}</span>
        <span className="countdown-label">Mnt</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item animate-pulse">
        <span className="countdown-value">{formatNumber(timeLeft.seconds)}</span>
        <span className="countdown-label">Dtk</span>
      </div>

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
    .countdown-timer {
        display: flex;
        align-items: center;
        gap: var(--space-1);
    }

    .countdown-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--gray-900);
        color: white;
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-lg);
        min-width: 44px;
    }

    .countdown-value {
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 700;
        line-height: 1;
    }

    .countdown-label {
        font-size: 9px;
        text-transform: uppercase;
        opacity: 0.7;
        margin-top: 2px;
    }

    .countdown-separator {
        font-size: var(--text-lg);
        font-weight: 700;
        color: var(--gray-900);
    }

    .animate-pulse {
        animation: pulse 1s ease infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    @media (min-width: 768px) {
        .countdown-item {
            padding: var(--space-2) var(--space-4);
            min-width: 52px;
        }
        .countdown-value {
            font-size: var(--text-xl);
        }
        .countdown-label {
            font-size: 10px;
        }
    }
`
