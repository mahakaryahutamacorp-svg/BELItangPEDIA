'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleCallback = async () => {
            const errorParam = searchParams.get('error')
            const errorDescription = searchParams.get('error_description')

            if (errorParam) {
                setError(errorDescription || 'Terjadi kesalahan saat login')
                return
            }

            // Redirect to home after successful auth
            router.push('/')
        }

        handleCallback()
    }, [router, searchParams])

    if (error) {
        return (
            <div className="callback-page">
                <div className="callback-container error">
                    <span className="icon">❌</span>
                    <h1>Login Gagal</h1>
                    <p>{error}</p>
                    <a href="/auth/login" className="btn btn-primary">Coba Lagi</a>
                </div>
                <style jsx>{`
                    .callback-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: var(--bg-secondary);
                    }
                    .callback-container {
                        text-align: center;
                        padding: var(--space-8);
                        background: var(--bg-primary);
                        border-radius: var(--radius-xl);
                        box-shadow: var(--shadow-lg);
                    }
                    .icon {
                        font-size: 48px;
                        display: block;
                        margin-bottom: var(--space-4);
                    }
                    h1 {
                        font-size: var(--text-xl);
                        margin-bottom: var(--space-2);
                    }
                    p {
                        color: var(--text-secondary);
                        margin-bottom: var(--space-6);
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="callback-page">
            <div className="callback-container">
                <div className="spinner"></div>
                <h1>Memproses Login...</h1>
                <p>Mohon tunggu sebentar</p>
            </div>
            <style jsx>{`
                .callback-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-secondary);
                }
                .callback-container {
                    text-align: center;
                    padding: var(--space-8);
                    background: var(--bg-primary);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-lg);
                }
                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid var(--gray-200);
                    border-top-color: var(--primary-500);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto var(--space-4);
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                h1 {
                    font-size: var(--text-xl);
                    margin-bottom: var(--space-2);
                }
                p {
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    )
}
