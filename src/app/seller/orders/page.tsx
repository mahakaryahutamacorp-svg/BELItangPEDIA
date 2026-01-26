'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Clock,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Loader2,
    ChevronRight,
    Phone,
    MapPin,
    Filter
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/mockData'

interface Order {
    id: string
    user_id: string
    status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled'
    payment_method: string
    payment_status: string
    shipping_address: {
        recipient_name: string
        phone: string
        address: string
        city: string
    }
    subtotal: number
    shipping_cost: number
    total: number
    notes: string | null
    created_at: string
    items?: OrderItem[]
}

interface OrderItem {
    id: string
    product_id: string
    quantity: number
    price: number
    total: number
    product?: {
        name: string
        images: string[]
    }
}

const STATUS_CONFIG = {
    pending: { label: 'Menunggu', icon: Clock, color: 'warning', next: 'confirmed' },
    confirmed: { label: 'Dikonfirmasi', icon: CheckCircle, color: 'primary', next: 'processing' },
    processing: { label: 'Diproses', icon: Package, color: 'primary', next: 'shipping' },
    shipping: { label: 'Dikirim', icon: Truck, color: 'info', next: 'delivered' },
    delivered: { label: 'Terkirim', icon: CheckCircle, color: 'success', next: 'completed' },
    completed: { label: 'Selesai', icon: CheckCircle, color: 'success', next: null },
    cancelled: { label: 'Dibatalkan', icon: XCircle, color: 'error', next: null },
}

export default function SellerOrdersPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { store, fetchMyStore, isLoading: storeLoading } = useStoreStore()

    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string>('all')
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

    // Fetch store
    useEffect(() => {
        if (user?.id && !store) {
            fetchMyStore(user.id)
        }
    }, [user?.id, store, fetchMyStore])

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?redirect=/seller/orders')
        }
    }, [user, authLoading, router])

    // Redirect if no store
    useEffect(() => {
        if (!storeLoading && user && !store) {
            router.push('/seller/register')
        }
    }, [store, storeLoading, user, router])

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!store?.id) return

            setIsLoading(true)
            setError(null)

            try {
                let query = supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            id,
                            product_id,
                            quantity,
                            price,
                            total
                        )
                    `)
                    .eq('store_id', store.id)
                    .order('created_at', { ascending: false })

                if (selectedStatus !== 'all') {
                    query = query.eq('status', selectedStatus)
                }

                const { data, error: fetchError } = await query

                if (fetchError) throw fetchError

                // Cast data to expected shape
                const ordersData = (data || []) as any[]

                // Fetch product info for each order item
                const ordersWithProducts = await Promise.all(
                    ordersData.map(async (order) => {
                        const orderItems = order.order_items || []
                        const itemsWithProducts = await Promise.all(
                            orderItems.map(async (item: OrderItem) => {
                                const { data: product } = await supabase
                                    .from('products')
                                    .select('name, images')
                                    .eq('id', item.product_id)
                                    .single()

                                return { ...item, product }
                            })
                        )

                        return {
                            ...order,
                            items: itemsWithProducts,
                            shipping_address: order.shipping_address as Order['shipping_address']
                        }
                    })
                )


                setOrders(ordersWithProducts as Order[])
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [store?.id, selectedStatus])

    const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            const { error: updateError } = await (supabase
                .from('orders') as any)
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', orderId)


            if (updateError) throw updateError

            // Update local state
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus as Order['status'] }
                        : order
                )
            )
        } catch (err) {
            setError((err as Error).message)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Loading state
    if (authLoading || storeLoading) {
        return (
            <div className="loading-container">
                <Loader2 className="spinner" size={48} />
                <p>Memuat...</p>
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

    return (
        <div className="orders-page">
            {/* Header */}
            <header className="page-header">
                <div className="header-left">
                    <Link href="/seller" className="back-btn" aria-label="Kembali ke Dashboard">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1>Pesanan</h1>
                </div>
            </header>

            {/* Status Filter Tabs */}
            <div className="status-tabs">
                <button
                    className={`tab ${selectedStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedStatus('all')}
                >
                    Semua
                </button>
                <button
                    className={`tab ${selectedStatus === 'pending' ? 'active' : ''}`}
                    onClick={() => setSelectedStatus('pending')}
                >
                    Baru
                </button>
                <button
                    className={`tab ${selectedStatus === 'processing' ? 'active' : ''}`}
                    onClick={() => setSelectedStatus('processing')}
                >
                    Diproses
                </button>
                <button
                    className={`tab ${selectedStatus === 'shipping' ? 'active' : ''}`}
                    onClick={() => setSelectedStatus('shipping')}
                >
                    Dikirim
                </button>
                <button
                    className={`tab ${selectedStatus === 'completed' ? 'active' : ''}`}
                    onClick={() => setSelectedStatus('completed')}
                >
                    Selesai
                </button>
            </div>

            {/* Orders List */}
            <div className="orders-list">
                {isLoading ? (
                    <div className="loading-state">
                        <Loader2 className="spinner" size={32} />
                        <p>Memuat pesanan...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <Package size={64} className="empty-icon" />
                        <h3>Belum ada pesanan</h3>
                        <p>Pesanan dari pembeli akan muncul di sini</p>
                    </div>
                ) : (
                    orders.map((order) => {
                        const statusConfig = STATUS_CONFIG[order.status]
                        const StatusIcon = statusConfig.icon
                        const isExpanded = expandedOrder === order.id

                        return (
                            <div key={order.id} className="order-card">
                                {/* Order Header */}
                                <div
                                    className="order-header"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                >
                                    <div className="order-info">
                                        <span className="order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
                                        <span className="order-date">{formatDate(order.created_at)}</span>
                                    </div>
                                    <div className="order-status-row">
                                        <span className={`status-badge ${statusConfig.color}`}>
                                            <StatusIcon size={12} />
                                            {statusConfig.label}
                                        </span>
                                        <ChevronRight
                                            size={18}
                                            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="order-items-preview">
                                    {order.items?.slice(0, 2).map((item) => (
                                        <div key={item.id} className="item-preview">
                                            {item.product?.images?.[0] && (
                                                <img src={item.product.images[0]} alt="" />
                                            )}
                                            <div className="item-info">
                                                <span className="item-name">{item.product?.name || 'Produk'}</span>
                                                <span className="item-qty">x{item.quantity}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(order.items?.length || 0) > 2 && (
                                        <span className="more-items">
                                            +{(order.items?.length || 0) - 2} produk lainnya
                                        </span>
                                    )}
                                </div>

                                {/* Order Total */}
                                <div className="order-total">
                                    <span>Total</span>
                                    <strong>{formatPrice(order.total)}</strong>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="order-details">
                                        {/* Shipping Address */}
                                        <div className="detail-section">
                                            <h4>Alamat Pengiriman</h4>
                                            <div className="address-info">
                                                <p className="recipient">{order.shipping_address?.recipient_name}</p>
                                                <p className="phone">
                                                    <Phone size={12} />
                                                    {order.shipping_address?.phone}
                                                </p>
                                                <p className="address">
                                                    <MapPin size={12} />
                                                    {order.shipping_address?.address}, {order.shipping_address?.city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {order.notes && (
                                            <div className="detail-section">
                                                <h4>Catatan</h4>
                                                <p className="notes">{order.notes}</p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {statusConfig.next && order.status !== 'cancelled' && (
                                            <div className="order-actions">
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                        >
                                                            Konfirmasi Pesanan
                                                        </button>
                                                        <button
                                                            className="btn btn-outline btn-sm"
                                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                        >
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'confirmed' && (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => updateOrderStatus(order.id, 'processing')}
                                                    >
                                                        Proses Pesanan
                                                    </button>
                                                )}
                                                {order.status === 'processing' && (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => updateOrderStatus(order.id, 'shipping')}
                                                    >
                                                        Kirim Pesanan
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <style jsx>{`
                .orders-page {
                    min-height: 100vh;
                    background: var(--bg-secondary);
                    padding-bottom: var(--space-6);
                }

                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-4);
                    background: var(--bg-primary);
                    border-bottom: 1px solid var(--border-light);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }

                .back-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-lg);
                    background: var(--gray-100);
                    color: var(--text-secondary);
                }

                .page-header h1 {
                    font-size: var(--text-lg);
                    font-weight: 600;
                }

                /* Status Tabs */
                .status-tabs {
                    display: flex;
                    gap: var(--space-2);
                    padding: var(--space-3) var(--space-4);
                    background: var(--bg-primary);
                    overflow-x: auto;
                    border-bottom: 1px solid var(--border-light);
                }

                .tab {
                    padding: var(--space-2) var(--space-4);
                    border-radius: var(--radius-full);
                    font-size: var(--text-sm);
                    font-weight: 500;
                    white-space: nowrap;
                    color: var(--text-secondary);
                    background: var(--gray-100);
                    transition: all var(--transition-fast);
                }

                .tab.active {
                    background: var(--primary-500);
                    color: white;
                }

                /* Orders List */
                .orders-list {
                    padding: var(--space-4);
                }

                .loading-state,
                .empty-state,
                .error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-12) var(--space-4);
                    text-align: center;
                }

                .loading-state :global(.spinner) {
                    animation: spin 1s linear infinite;
                    color: var(--primary-500);
                    margin-bottom: var(--space-4);
                }

                .empty-state :global(.empty-icon) {
                    color: var(--gray-300);
                    margin-bottom: var(--space-4);
                }

                .empty-state h3 {
                    font-size: var(--text-lg);
                    margin-bottom: var(--space-2);
                }

                .empty-state p,
                .error-state p {
                    color: var(--text-tertiary);
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Order Card */
                .order-card {
                    background: var(--bg-primary);
                    border-radius: var(--radius-xl);
                    margin-bottom: var(--space-3);
                    overflow: hidden;
                    border: 1px solid var(--border-light);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-4);
                    cursor: pointer;
                }

                .order-info {
                    display: flex;
                    flex-direction: column;
                }

                .order-id {
                    font-weight: 600;
                    font-size: var(--text-sm);
                }

                .order-date {
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                }

                .order-status-row {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    font-size: 11px;
                    font-weight: 600;
                }

                .status-badge.warning {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-badge.primary {
                    background: var(--primary-100);
                    color: var(--primary-700);
                }

                .status-badge.info {
                    background: #dbeafe;
                    color: #1e40af;
                }

                .status-badge.success {
                    background: var(--secondary-100);
                    color: var(--secondary-700);
                }

                .status-badge.error {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .order-header :global(.expand-icon) {
                    color: var(--text-tertiary);
                    transition: transform var(--transition-fast);
                }

                .order-header :global(.expand-icon.expanded) {
                    transform: rotate(90deg);
                }

                .order-items-preview {
                    padding: 0 var(--space-4) var(--space-3);
                }

                .item-preview {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    margin-bottom: var(--space-2);
                }

                .item-preview img {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-md);
                    object-fit: cover;
                }

                .item-info {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                }

                .item-name {
                    font-size: var(--text-sm);
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .item-qty {
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                }

                .more-items {
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                }

                .order-total {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--space-3) var(--space-4);
                    border-top: 1px solid var(--border-light);
                    font-size: var(--text-sm);
                }

                .order-total strong {
                    color: var(--primary-600);
                }

                /* Order Details */
                .order-details {
                    padding: var(--space-4);
                    border-top: 1px solid var(--border-light);
                    background: var(--gray-50);
                }

                .detail-section {
                    margin-bottom: var(--space-4);
                }

                .detail-section:last-child {
                    margin-bottom: 0;
                }

                .detail-section h4 {
                    font-size: var(--text-xs);
                    font-weight: 600;
                    color: var(--text-tertiary);
                    text-transform: uppercase;
                    margin-bottom: var(--space-2);
                }

                .address-info p {
                    font-size: var(--text-sm);
                    margin-bottom: var(--space-1);
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                }

                .address-info .recipient {
                    font-weight: 600;
                }

                .notes {
                    font-size: var(--text-sm);
                    color: var(--text-secondary);
                    font-style: italic;
                }

                .order-actions {
                    display: flex;
                    gap: var(--space-2);
                    margin-top: var(--space-4);
                }

                .btn-sm {
                    padding: var(--space-2) var(--space-4);
                    font-size: var(--text-sm);
                }

                .btn-outline {
                    background: transparent;
                    border: 1px solid var(--border-light);
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    )
}
