'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Clock,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/mockData'

export default function SellerWalletPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { store, fetchMyStore, isLoading: storeLoading, hasFetched } = useStoreStore()
  const [isLoading, setIsLoading] = useState(true)
  const [balance, setBalance] = useState({
    available: 0,
    pending: 0,
    totalEarnings: 0
  })
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    type: 'in' | 'out';
    amount: number;
    description: string;
    date: string;
    status: string;
  }>>([])

  // Fetch store
  useEffect(() => {
    if (user?.id) {
      fetchMyStore(user.id)
    }
  }, [user?.id, fetchMyStore])

  // Redirect if not logged in or no store
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/seller/wallet')
    }
    if (hasFetched && !storeLoading && user && !store) {
      router.push('/seller/register')
    }
  }, [user, authLoading, store, storeLoading, hasFetched, router])

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!store?.id) return
      setIsLoading(true)

      try {
        // Fetch completed orders for earnings
        type OrderData = { total: number; status: string; created_at: string }
        const { data: orders } = await supabase
          .from('orders')
          .select('total, status, created_at')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false }) as { data: OrderData[] | null }

        const completedOrders = (orders || []).filter((o: OrderData) => o.status === 'completed')
        const pendingOrders = (orders || []).filter((o: OrderData) => ['confirmed', 'processing', 'shipping', 'delivered'].includes(o.status))

        const totalEarnings = completedOrders.reduce((sum: number, o: OrderData) => sum + (o.total || 0), 0)
        const pendingAmount = pendingOrders.reduce((sum: number, o: OrderData) => sum + (o.total || 0), 0)

        setBalance({
          available: Math.floor(totalEarnings * 0.97), // After platform fee
          pending: Math.floor(pendingAmount * 0.97),
          totalEarnings: totalEarnings
        })

        // Create mock transactions from orders
        const txns = (orders || []).slice(0, 10).map((order: OrderData, idx: number) => ({
          id: `txn-${idx}`,
          type: 'in' as const,
          amount: Math.floor((order.total || 0) * 0.97),
          description: order.status === 'completed' ? 'Pembayaran pesanan' : 'Pending pesanan',
          date: order.created_at || new Date().toISOString(),
          status: order.status === 'completed' ? 'success' : 'pending'
        }))

        setTransactions(txns)
      } catch (error) {
        console.error('Error fetching wallet:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWalletData()
  }, [store?.id])

  if (authLoading || storeLoading || !hasFetched) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner" size={48} />
        <p>Memuat dompet...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--bg-secondary);
          }
          .loading-container :global(.spinner) {
            animation: spin 1s linear infinite;
            color: var(--primary-500);
            margin-bottom: var(--space-4);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!store) return null

  return (
    <div className="wallet-page">
      <header className="page-header">
        <Link href="/seller" className="back-btn">
          <ArrowLeft size={24} />
        </Link>
        <h1>Dompet Seller</h1>
      </header>

      {/* Balance Card */}
      <section className="balance-card">
        <div className="balance-header">
          <Wallet size={24} />
          <span>Saldo Tersedia</span>
        </div>
        <div className="balance-amount">
          {formatPrice(balance.available)}
        </div>
        <div className="balance-pending">
          <Clock size={14} />
          <span>Pending: {formatPrice(balance.pending)}</span>
        </div>
        <div className="balance-actions">
          <button className="btn btn-primary" disabled>
            <CreditCard size={16} />
            Tarik Dana
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Pendapatan</span>
            <span className="stat-value">{formatPrice(balance.totalEarnings)}</span>
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section className="transactions-section">
        <div className="section-header">
          <h2>Riwayat Transaksi</h2>
        </div>

        {isLoading ? (
          <div className="loading-inline">
            <Loader2 className="spinner" size={24} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={48} />
            <p>Belum ada transaksi</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((txn) => (
              <div key={txn.id} className="transaction-item">
                <div className={`txn-icon ${txn.type}`}>
                  {txn.type === 'in' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div className="txn-info">
                  <span className="txn-desc">{txn.description}</span>
                  <span className="txn-date">
                    {new Date(txn.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className={`txn-amount ${txn.type}`}>
                  {txn.type === 'in' ? '+' : '-'}{formatPrice(txn.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info */}
      <section className="info-card">
        <AlertCircle size={20} />
        <div>
          <strong>Catatan Penting</strong>
          <p>Dana akan dapat ditarik setelah pesanan selesai dan melewati masa tunggu 3 hari.</p>
        </div>
      </section>

      <style jsx>{`
        .wallet-page {
          min-height: 100vh;
          background: var(--bg-secondary);
          padding-bottom: var(--space-8);
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .back-btn {
          color: var(--text-secondary);
        }

        .page-header h1 {
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .balance-card {
          margin: var(--space-4);
          padding: var(--space-6);
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          border-radius: var(--radius-xl);
          color: white;
        }

        .balance-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          opacity: 0.9;
          margin-bottom: var(--space-2);
        }

        .balance-amount {
          font-size: var(--text-3xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }

        .balance-pending {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          opacity: 0.8;
          margin-bottom: var(--space-4);
        }

        .balance-actions {
          display: flex;
          gap: var(--space-3);
        }

        .balance-actions :global(.btn) {
          flex: 1;
          background: white;
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
        }

        .balance-actions :global(.btn:disabled) {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .stats-section {
          padding: 0 var(--space-4);
          margin-bottom: var(--space-4);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.green {
          background: var(--secondary-100);
          color: var(--secondary-600);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .stat-value {
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .transactions-section {
          padding: 0 var(--space-4);
          margin-bottom: var(--space-4);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .section-header h2 {
          font-size: var(--text-base);
          font-weight: 600;
        }

        .transactions-list {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-light);
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .txn-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .txn-icon.in {
          background: var(--secondary-100);
          color: var(--secondary-600);
        }

        .txn-icon.out {
          background: #fef2f2;
          color: var(--accent-red);
        }

        .txn-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .txn-desc {
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .txn-date {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .txn-amount {
          font-weight: 600;
        }

        .txn-amount.in {
          color: var(--secondary-600);
        }

        .txn-amount.out {
          color: var(--accent-red);
        }

        .loading-inline,
        .empty-state {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
        }

        .loading-inline :global(.spinner) {
          animation: spin 1s linear infinite;
          color: var(--primary-500);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state :global(svg) {
          margin-bottom: var(--space-2);
          opacity: 0.5;
        }

        .info-card {
          margin: 0 var(--space-4);
          padding: var(--space-4);
          background: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: var(--radius-xl);
          display: flex;
          gap: var(--space-3);
          color: #92400e;
        }

        .info-card :global(svg) {
          flex-shrink: 0;
        }

        .info-card strong {
          font-size: var(--text-sm);
          display: block;
          margin-bottom: var(--space-1);
        }

        .info-card p {
          font-size: var(--text-xs);
        }
      `}</style>
    </div>
  )
}
