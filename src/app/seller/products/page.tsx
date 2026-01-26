'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Plus,
    Search,
    Package,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    AlertCircle,
    ImageIcon
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'
import { productService } from '@/lib/services/productService'
import { formatPrice } from '@/lib/mockData'
import { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

export default function SellerProductsPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { store, fetchMyStore, isLoading: storeLoading } = useStoreStore()

    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [totalProducts, setTotalProducts] = useState(0)

    // Fetch store data
    useEffect(() => {
        if (user?.id && !store) {
            fetchMyStore(user.id)
        }
    }, [user?.id, store, fetchMyStore])

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?redirect=/seller/products')
        }
    }, [user, authLoading, router])

    // Redirect if no store
    useEffect(() => {
        if (!storeLoading && user && !store) {
            router.push('/seller/register')
        }
    }, [store, storeLoading, user, router])

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!store?.id) return

            setIsLoading(true)
            setError(null)

            const { data, error: fetchError, count } = await productService.getProductsByStore(
                store.id,
                { searchQuery: searchQuery || undefined }
            )

            if (fetchError) {
                setError(fetchError.message)
            } else {
                setProducts(data)
                setTotalProducts(count)
            }

            setIsLoading(false)
        }

        fetchProducts()
    }, [store?.id, searchQuery])

    const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
        const { data, error: toggleError } = await productService.toggleProductStatus(productId, !currentStatus)

        if (toggleError) {
            setError(toggleError.message)
            return
        }

        if (data) {
            setProducts(prev => prev.map(p => p.id === productId ? data : p))
        }
    }

    const handleDelete = async (productId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return
        if (!store?.id) return

        const { success, error: deleteError } = await productService.deleteProduct(productId, store.id)

        if (deleteError) {
            setError(deleteError.message)
            return
        }

        if (success) {
            setProducts(prev => prev.filter(p => p.id !== productId))
            setTotalProducts(prev => prev - 1)
        }
    }

    // Show loading
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
        <div className="products-page">
            {/* Header */}
            <header className="page-header">
                <div className="header-left">
                    <Link href="/seller" className="back-btn" aria-label="Kembali ke Dashboard">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1>Produk Saya</h1>
                        <p>{totalProducts} produk</p>
                    </div>
                </div>
                <Link href="/seller/products/new" className="btn btn-primary btn-sm">
                    <Plus size={16} />
                    <span>Tambah</span>
                </Link>
            </header>

            {/* Search */}
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Error Alert */}
            {error && (
                <div className="error-alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Products List */}
            <div className="products-list">
                {isLoading ? (
                    <div className="loading-state">
                        <Loader2 className="spinner" size={32} />
                        <p>Memuat produk...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <Package size={64} className="empty-icon" />
                        <h3>Belum ada produk</h3>
                        <p>Mulai tambahkan produk untuk dijual</p>
                        <Link href="/seller/products/new" className="btn btn-primary">
                            <Plus size={18} />
                            Tambah Produk
                        </Link>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className={`product-card ${!product.is_active ? 'inactive' : ''}`}>
                            <div className="product-image" style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="no-image">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <div className="product-meta">
                                    <span className="price">
                                        {formatPrice(product.discount_price || product.price)}
                                    </span>
                                    <span className="stock">Stok: {product.stock}</span>
                                </div>
                                <div className="product-stats">
                                    <span>{product.total_sold || 0} terjual</span>
                                    <span className={`status ${product.is_active ? 'active' : 'inactive'}`}>
                                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                            </div>
                            <div className="product-actions">
                                <button
                                    className="action-btn toggle"
                                    onClick={() => handleToggleStatus(product.id, product.is_active)}
                                    title={product.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                >
                                    {product.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                </button>
                                <Link
                                    href={`/seller/products/${product.id}/edit`}
                                    className="action-btn edit"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDelete(product.id)}
                                    title="Hapus"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .products-page {
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

                .header-left h1 {
                    font-size: var(--text-lg);
                    font-weight: 600;
                }

                .header-left p {
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                }

                .search-bar {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    margin: var(--space-4);
                    padding: var(--space-3);
                    background: var(--bg-primary);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-light);
                }

                .search-bar :global(.search-icon) {
                    color: var(--text-tertiary);
                }

                .search-bar input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    font-size: var(--text-sm);
                }

                .search-bar input:focus {
                    outline: none;
                }

                .error-alert {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    margin: 0 var(--space-4) var(--space-4);
                    padding: var(--space-3);
                    background: #fee2e2;
                    color: #991b1b;
                    border-radius: var(--radius-lg);
                    font-size: var(--text-sm);
                }

                .products-list {
                    padding: 0 var(--space-4);
                }

                .loading-state,
                .empty-state {
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

                .empty-state p {
                    color: var(--text-tertiary);
                    margin-bottom: var(--space-6);
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .product-card {
                    display: flex;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    background: var(--bg-primary);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-3);
                    border: 1px solid var(--border-light);
                }

                .product-card.inactive {
                    opacity: 0.6;
                }

                .product-image {
                    width: 80px;
                    height: 80px;
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .product-image .no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--gray-100);
                    color: var(--gray-400);
                }

                .product-info {
                    flex: 1;
                    min-width: 0;
                }

                .product-info h3 {
                    font-size: var(--text-sm);
                    font-weight: 600;
                    margin-bottom: var(--space-1);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .product-meta {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    margin-bottom: var(--space-1);
                }

                .product-meta .price {
                    font-size: var(--text-sm);
                    font-weight: 600;
                    color: var(--primary-600);
                }

                .product-meta .stock {
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                }

                .product-stats {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                }

                .product-stats .status {
                    padding: 2px 6px;
                    border-radius: var(--radius-full);
                    font-weight: 500;
                }

                .product-stats .status.active {
                    background: var(--secondary-100);
                    color: var(--secondary-700);
                }

                .product-stats .status.inactive {
                    background: var(--gray-100);
                    color: var(--text-tertiary);
                }

                .product-actions {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .action-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-md);
                    background: var(--gray-100);
                    color: var(--text-secondary);
                    transition: all var(--transition-fast);
                }

                .action-btn:hover {
                    background: var(--gray-200);
                }

                .action-btn.toggle {
                    color: var(--secondary-600);
                }

                .action-btn.edit {
                    color: var(--primary-600);
                }

                .action-btn.delete {
                    color: var(--accent-red);
                }

                .action-btn.delete:hover {
                    background: #fee2e2;
                }
            `}</style>
        </div>
    )
}
