'use client'

import { useState, useEffect, useRef, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Upload,
    X,
    Loader2,
    AlertCircle,
    CheckCircle,
    Package,
    DollarSign,
    Layers,
    FileText,
    Image as ImageIcon,
    Trash2
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreStore } from '@/store/storeStore'
import { productService } from '@/lib/services/productService'
import { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

interface Category {
    id: string
    name: string
    slug: string
    icon: string
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const productId = resolvedParams.id

    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { store, fetchMyStore, isLoading: storeLoading } = useStoreStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [product, setProduct] = useState<Product | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        categoryId: '',
    })
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Fetch store
    useEffect(() => {
        if (user?.id && !store) {
            fetchMyStore(user.id)
        }
    }, [user?.id, store, fetchMyStore])

    // Fetch product and categories
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)

            // Load categories
            const { data: cats } = await productService.getCategories()
            setCategories(cats)

            // Load product
            const { data: prod, error: prodError } = await productService.getProductById(productId)

            if (prodError || !prod) {
                setError('Produk tidak ditemukan')
                setIsLoading(false)
                return
            }

            setProduct(prod)
            setFormData({
                name: prod.name,
                description: prod.description,
                price: prod.price.toString(),
                discountPrice: prod.discount_price?.toString() || '',
                stock: prod.stock.toString(),
                categoryId: prod.category_id,
            })
            setExistingImages(prod.images || [])
            setIsLoading(false)
        }

        loadData()
    }, [productId])

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

    // Verify product belongs to seller's store
    useEffect(() => {
        if (product && store && product.store_id !== store.id) {
            router.push('/seller/products')
        }
    }, [product, store, router])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        // Limit total to 5 images
        const totalImages = existingImages.length + newImages.length + files.length
        const allowedNew = Math.min(files.length, 5 - existingImages.length - newImages.length)

        if (allowedNew <= 0) return

        const newFiles = files.slice(0, allowedNew)
        setNewImages(prev => [...prev, ...newFiles])

        // Create previews
        newFiles.forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setNewImagePreviews(prev => [...prev, e.target?.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index))
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nama produk harus diisi'
        } else if (formData.name.length < 5) {
            newErrors.name = 'Nama produk minimal 5 karakter'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Deskripsi produk harus diisi'
        } else if (formData.description.length < 20) {
            newErrors.description = 'Deskripsi minimal 20 karakter'
        }

        const price = parseInt(formData.price)
        if (!formData.price || isNaN(price)) {
            newErrors.price = 'Harga harus diisi'
        } else if (price < 100) {
            newErrors.price = 'Harga minimal Rp100'
        }

        if (formData.discountPrice) {
            const discountPrice = parseInt(formData.discountPrice)
            if (isNaN(discountPrice)) {
                newErrors.discountPrice = 'Harga diskon tidak valid'
            } else if (discountPrice >= price) {
                newErrors.discountPrice = 'Harga diskon harus lebih kecil dari harga asli'
            }
        }

        const stock = parseInt(formData.stock)
        if (!formData.stock || isNaN(stock)) {
            newErrors.stock = 'Stok harus diisi'
        } else if (stock < 0) {
            newErrors.stock = 'Stok tidak boleh negatif'
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Pilih kategori produk'
        }

        const totalImages = existingImages.length + newImages.length
        if (totalImages === 0) {
            newErrors.images = 'Produk harus memiliki minimal 1 foto'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        if (!store?.id || !product) return

        setIsSubmitting(true)
        setError(null)

        try {
            let allImages = [...existingImages]

            // Upload new images if any
            if (newImages.length > 0) {
                const { urls: newUrls, error: uploadError } = await productService.uploadProductImages(
                    newImages,
                    product.id
                )

                if (uploadError) {
                    throw uploadError
                }

                allImages = [...allImages, ...newUrls]
            }

            // Update product
            const { error: updateError } = await productService.updateProduct(product.id, {
                category_id: formData.categoryId,
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseInt(formData.price),
                discount_price: formData.discountPrice ? parseInt(formData.discountPrice) : null,
                stock: parseInt(formData.stock),
                images: allImages,
            })

            if (updateError) {
                throw updateError
            }

            setSuccess(true)

            // Redirect after short delay
            setTimeout(() => {
                router.push('/seller/products')
            }, 1500)

        } catch (err) {
            setError((err as Error).message || 'Gagal mengupdate produk')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
            return
        }
        if (!store?.id || !product) return

        setIsDeleting(true)
        setError(null)

        try {
            const { success: deleted, error: deleteError } = await productService.deleteProduct(product.id, store.id)

            if (deleteError) {
                throw deleteError
            }

            if (deleted) {
                router.push('/seller/products')
            }
        } catch (err) {
            setError((err as Error).message || 'Gagal menghapus produk')
        } finally {
            setIsDeleting(false)
        }
    }

    // Loading state
    if (authLoading || storeLoading || isLoading) {
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

    // Success state
    if (success) {
        return (
            <div className="success-container">
                <div className="success-card">
                    <CheckCircle size={64} className="success-icon" />
                    <h1>Produk Berhasil Diperbarui! ✅</h1>
                    <p>Perubahan telah disimpan.</p>
                    <div className="redirect-text">
                        <Loader2 className="spinner" size={16} />
                        <span>Kembali ke daftar produk...</span>
                    </div>
                </div>
                <style jsx>{`
                    .success-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: var(--bg-secondary);
                        padding: var(--space-4);
                    }
                    .success-card {
                        background: var(--bg-primary);
                        padding: var(--space-8);
                        border-radius: var(--radius-xl);
                        text-align: center;
                        max-width: 400px;
                    }
                    .success-card :global(.success-icon) {
                        color: var(--secondary-500);
                        margin-bottom: var(--space-4);
                    }
                    .success-card h1 {
                        font-size: var(--text-xl);
                        margin-bottom: var(--space-2);
                    }
                    .success-card p {
                        color: var(--text-secondary);
                        margin-bottom: var(--space-6);
                    }
                    .redirect-text {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: var(--space-2);
                        color: var(--text-tertiary);
                        font-size: var(--text-sm);
                    }
                    .redirect-text :global(.spinner) {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    const totalImages = existingImages.length + newImages.length

    return (
        <div className="edit-product-page">
            {/* Header */}
            <header className="page-header">
                <Link href="/seller/products" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <h1>Edit Produk</h1>
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? <Loader2 className="spinner" size={18} /> : <Trash2 size={18} />}
                </button>
            </header>

            {/* Error Alert */}
            {error && (
                <div className="error-alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            <form className="product-form" onSubmit={handleSubmit}>
                {/* Images Section */}
                <section className="form-section">
                    <h2>
                        <ImageIcon size={18} />
                        Foto Produk
                    </h2>
                    <p className="section-desc">Upload hingga 5 foto. Foto pertama akan menjadi cover.</p>

                    <div className="image-grid">
                        {/* Existing Images */}
                        {existingImages.map((url, index) => (
                            <div key={`existing-${index}`} className="image-item">
                                <img src={url} alt={`Product ${index + 1}`} />
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeExistingImage(index)}
                                >
                                    <X size={16} />
                                </button>
                                {index === 0 && newImages.length === 0 && <span className="cover-badge">Cover</span>}
                            </div>
                        ))}

                        {/* New Images */}
                        {newImagePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="image-item new">
                                <img src={preview} alt={`New ${index + 1}`} />
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeNewImage(index)}
                                >
                                    <X size={16} />
                                </button>
                                <span className="new-badge">Baru</span>
                            </div>
                        ))}

                        {/* Upload Button */}
                        {totalImages < 5 && (
                            <button
                                type="button"
                                className="upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={24} />
                                <span>Upload</span>
                            </button>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        hidden
                    />
                    {errors.images && <span className="error-text">{errors.images}</span>}
                </section>

                {/* Basic Info */}
                <section className="form-section">
                    <h2>
                        <Package size={18} />
                        Informasi Produk
                    </h2>

                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                        <label>Nama Produk *</label>
                        <input
                            type="text"
                            placeholder="Contoh: Beras Premium 5kg"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={isSubmitting}
                            maxLength={100}
                        />
                        <div className="input-footer">
                            {errors.name && <span className="error-text">{errors.name}</span>}
                            <span className="char-count">{formData.name.length}/100</span>
                        </div>
                    </div>

                    <div className={`form-group ${errors.categoryId ? 'has-error' : ''}`}>
                        <label>Kategori *</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => handleInputChange('categoryId', e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
                    </div>

                    <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
                        <label>
                            <FileText size={16} />
                            Deskripsi *
                        </label>
                        <textarea
                            placeholder="Jelaskan detail produk Anda..."
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={isSubmitting}
                            rows={4}
                            maxLength={2000}
                        />
                        <div className="input-footer">
                            {errors.description && <span className="error-text">{errors.description}</span>}
                            <span className="char-count">{formData.description.length}/2000</span>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="form-section">
                    <h2>
                        <DollarSign size={18} />
                        Harga & Stok
                    </h2>

                    <div className="form-row">
                        <div className={`form-group ${errors.price ? 'has-error' : ''}`}>
                            <label>Harga *</label>
                            <div className="input-with-prefix">
                                <span className="prefix">Rp</span>
                                <input
                                    type="number"
                                    placeholder="50000"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    disabled={isSubmitting}
                                    min={0}
                                />
                            </div>
                            {errors.price && <span className="error-text">{errors.price}</span>}
                        </div>

                        <div className={`form-group ${errors.discountPrice ? 'has-error' : ''}`}>
                            <label>Harga Diskon</label>
                            <div className="input-with-prefix">
                                <span className="prefix">Rp</span>
                                <input
                                    type="number"
                                    placeholder="45000"
                                    value={formData.discountPrice}
                                    onChange={(e) => handleInputChange('discountPrice', e.target.value)}
                                    disabled={isSubmitting}
                                    min={0}
                                />
                            </div>
                            {errors.discountPrice && <span className="error-text">{errors.discountPrice}</span>}
                        </div>
                    </div>

                    <div className={`form-group ${errors.stock ? 'has-error' : ''}`}>
                        <label>
                            <Layers size={16} />
                            Stok *
                        </label>
                        <input
                            type="number"
                            placeholder="100"
                            value={formData.stock}
                            onChange={(e) => handleInputChange('stock', e.target.value)}
                            disabled={isSubmitting}
                            min={0}
                        />
                        {errors.stock && <span className="error-text">{errors.stock}</span>}
                    </div>
                </section>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="spinner" size={18} />
                            Menyimpan...
                        </>
                    ) : (
                        'Simpan Perubahan'
                    )}
                </button>
            </form>

            <style jsx>{`
                .edit-product-page {
                    min-height: 100vh;
                    background: var(--bg-secondary);
                    padding-bottom: var(--space-8);
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

                .delete-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-lg);
                    background: #fee2e2;
                    color: var(--accent-red);
                }

                .delete-btn:disabled {
                    opacity: 0.6;
                }

                .delete-btn :global(.spinner) {
                    animation: spin 1s linear infinite;
                }

                .error-alert {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    margin: var(--space-4);
                    padding: var(--space-3);
                    background: #fee2e2;
                    color: #991b1b;
                    border-radius: var(--radius-lg);
                    font-size: var(--text-sm);
                }

                .product-form {
                    padding: var(--space-4);
                }

                .form-section {
                    background: var(--bg-primary);
                    border-radius: var(--radius-xl);
                    padding: var(--space-5);
                    margin-bottom: var(--space-4);
                }

                .form-section h2 {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-base);
                    font-weight: 600;
                    margin-bottom: var(--space-2);
                }

                .section-desc {
                    font-size: var(--text-sm);
                    color: var(--text-tertiary);
                    margin-bottom: var(--space-4);
                }

                /* Image Grid */
                .image-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-3);
                }

                .image-item {
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }

                .image-item.new {
                    border: 2px solid var(--secondary-500);
                }

                .image-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-item .remove-btn {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    border-radius: var(--radius-full);
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .image-item .cover-badge {
                    position: absolute;
                    bottom: 4px;
                    left: 4px;
                    padding: 2px 6px;
                    background: var(--primary-500);
                    color: white;
                    font-size: 10px;
                    font-weight: 600;
                    border-radius: var(--radius-sm);
                }

                .image-item .new-badge {
                    position: absolute;
                    bottom: 4px;
                    left: 4px;
                    padding: 2px 6px;
                    background: var(--secondary-500);
                    color: white;
                    font-size: 10px;
                    font-weight: 600;
                    border-radius: var(--radius-sm);
                }

                .upload-btn {
                    aspect-ratio: 1;
                    border: 2px dashed var(--border-light);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-1);
                    color: var(--text-tertiary);
                    font-size: var(--text-xs);
                    transition: all var(--transition-fast);
                }

                .upload-btn:hover {
                    border-color: var(--primary-500);
                    color: var(--primary-500);
                    background: var(--primary-50);
                }

                /* Form Groups */
                .form-group {
                    margin-bottom: var(--space-4);
                }

                .form-group:last-child {
                    margin-bottom: 0;
                }

                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-sm);
                    font-weight: 500;
                    margin-bottom: var(--space-2);
                    color: var(--text-secondary);
                }

                .form-group input,
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: var(--space-3);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    font-size: var(--text-sm);
                    transition: border-color var(--transition-fast);
                }

                .form-group input:focus,
                .form-group textarea:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: var(--primary-500);
                }

                .form-group.has-error input,
                .form-group.has-error textarea,
                .form-group.has-error select {
                    border-color: #ef4444;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                }

                .input-with-prefix {
                    display: flex;
                    align-items: stretch;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }

                .form-group.has-error .input-with-prefix {
                    border-color: #ef4444;
                }

                .input-with-prefix .prefix {
                    padding: var(--space-3);
                    background: var(--gray-100);
                    color: var(--text-tertiary);
                    font-size: var(--text-sm);
                    font-weight: 500;
                }

                .input-with-prefix input {
                    border: none;
                    border-radius: 0;
                }

                .input-with-prefix input:focus {
                    outline: none;
                }

                .input-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: var(--space-1);
                }

                .char-count {
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                }

                .error-text {
                    color: #ef4444;
                    font-size: var(--text-xs);
                }

                .btn-lg {
                    width: 100%;
                    padding: var(--space-4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    font-size: var(--text-base);
                    margin-top: var(--space-4);
                }

                .btn-lg:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-lg :global(.spinner) {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
