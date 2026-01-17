'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'

interface CountdownTimerProps {
    endTime: string
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endTime).getTime() - new Date().getTime()

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    const formatNumber = (num: number) => num.toString().padStart(2, '0')

    return (
        <div className="countdown-timer">
            <div className="timer-label">
                <Zap size={16} fill="currentColor" />
                <span>Berakhir dalam</span>
            </div>
            <div className="timer-boxes">
                <div className="timer-box">{formatNumber(timeLeft.hours)}</div>
                <span className="timer-separator">:</span>
                <div className="timer-box">{formatNumber(timeLeft.minutes)}</div>
                <span className="timer-separator">:</span>
                <div className="timer-box">{formatNumber(timeLeft.seconds)}</div>
            </div>

            <style jsx>{`
        .countdown-timer {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .timer-label {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          color: var(--text-inverse);
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .timer-boxes {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .timer-box {
          background: var(--gray-900);
          color: white;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: var(--text-sm);
          min-width: 32px;
          text-align: center;
          font-family: monospace;
        }

        .timer-separator {
          color: white;
          font-weight: 700;
        }
      `}</style>
        </div>
    )
}
