'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image' // Added Image import
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import {
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Upload,
    ArrowLeft,
    ImageIcon,
    GripVertical
} from 'lucide-react'

interface Banner {
    id: string
    title: string
    image_url: string
    link: string
    is_active: boolean
    order: number
}

export default function AdminBannersPage() {
    const router = useRouter()
    const { user, isAuthenticated, isAdmin } = useAuthStore()
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [accessDenied, setAccessDenied] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        link: '',
        is_active: true
    })

    // Check admin access
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/admin/banners')
        } else if (!isAdmin()) {
            setAccessDenied(true)
        }
    }, [isAuthenticated, isAdmin, router])

    // Fetch banners
    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('order', { ascending: true })

            if (error) throw error
            setBanners(data || [])
        } catch (error) {
            console.error('Error fetching banners:', error)
            // Use mock data if table doesn't exist
            setBanners([
                { id: '1', title: 'Promo Akhir Tahun', image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', link: '/promo', is_active: true, order: 1 },
                { id: '2', title: 'Gratis Ongkir', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200', link: '/gratis-ongkir', is_active: true, order: 2 },
                { id: '3', title: 'Dukung UMKM Lokal', image_url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200', link: '/umkm', is_active: true, order: 3 },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `banner-${Date.now()}.${fileExt}`
            const filePath = `banners/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, image_url: publicUrl }))
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Gagal upload gambar. Coba lagi.')
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        if (!formData.title || !formData.image_url) {
            alert('Judul dan gambar harus diisi')
            return
        }

        setSaving(true)
        try {
            if (editingId) {
                // Update existing
                const { error } = await (supabase.from('banners') as any)
                    .update({
                        title: formData.title,
                        image_url: formData.image_url,
                        link: formData.link,
                        is_active: formData.is_active
                    })
                    .eq('id', editingId)

                if (error) throw error
            } else {
                // Create new
                const { error } = await (supabase.from('banners') as any)
                    .insert({
                        title: formData.title,
                        image_url: formData.image_url,
                        link: formData.link,
                        is_active: formData.is_active,
                        order: banners.length + 1
                    })

                if (error) throw error
            }

            await fetchBanners()
            resetForm()
        } catch (error) {
            console.error('Error saving banner:', error)
            alert('Gagal menyimpan. Pastikan tabel banners sudah dibuat di Supabase.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus banner ini?')) return

        try {
            const { error } = await supabase
                .from('banners')
                .delete()
                .eq('id', id)

            if (error) throw error
            await fetchBanners()
        } catch (error) {
            console.error('Error deleting banner:', error)
            alert('Gagal menghapus')
        }
    }

    const handleEdit = (banner: Banner) => {
        setEditingId(banner.id)
        setFormData({
            title: banner.title,
            image_url: banner.image_url,
            link: banner.link || '',
            is_active: banner.is_active
        })
        setShowAddForm(true)
    }

    const resetForm = () => {
        setFormData({ title: '', image_url: '', link: '', is_active: true })
        setEditingId(null)
        setShowAddForm(false)
    }

    if (!isAuthenticated) {
        return <div className="loading-screen">Loading...</div>
    }

    if (accessDenied) {
        return (
            <div className="access-denied-screen">
                <div className="access-denied-card">
                    <span className="lock-icon">🔒</span>
                    <h1 className="access-denied-title">Akses Ditolak</h1>
                    <p className="access-denied-text">
                        Halaman ini hanya untuk Admin. Hubungi admin untuk mendapatkan akses.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-back-home"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-page-container">
            {/* Header */}
            <header className="admin-header">
                <div className="header-left">
                    <button
                        onClick={() => router.push('/')}
                        aria-label="Kembali"
                        className="btn-back-arrow"
                    >
                        <ArrowLeft size={24} color="#333" />
                    </button>
                    <h1 className="header-title">Kelola Banner</h1>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="btn-add-banner"
                >
                    <Plus size={18} />
                    Tambah
                </button>
            </header>

            {/* Content */}
            <main className="admin-main">
                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="form-card">
                        <div className="form-header">
                            <h2 className="form-title">
                                {editingId ? 'Edit Banner' : 'Tambah Banner Baru'}
                            </h2>
                            <button onClick={resetForm} aria-label="Tutup" className="btn-close-form">
                                <X size={20} color="#666" />
                            </button>
                        </div>

                        <div className="form-body">
                            {/* Image Upload */}
                            <div className="form-group">
                                <label className="form-label">Gambar Banner</label>
                                {formData.image_url ? (
                                    <div className="image-preview-container">
                                        <Image
                                            src={formData.image_url}
                                            alt="Preview"
                                            fill
                                            className="image-preview"
                                        />
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                            aria-label="Hapus Gambar"
                                            className="remove-image-btn"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="upload-placeholder">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden-file-input"
                                        />
                                        {uploading ? (
                                            <span className="upload-status">Uploading...</span>
                                        ) : (
                                            <>
                                                <Upload size={24} color="#999" />
                                                <span className="upload-text">Upload Gambar</span>
                                            </>
                                        )}
                                    </label>
                                )}
                                <p className="input-hint">Atau paste URL gambar di bawah</p>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.image_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                    className="form-input"
                                />
                            </div>

                            {/* Title */}
                            <div className="form-group">
                                <label className="form-label">Judul Banner</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Promo Akhir Tahun"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="form-input"
                                />
                            </div>

                            {/* Link */}
                            <div className="form-group">
                                <label className="form-label">Link (opsional)</label>
                                <input
                                    type="text"
                                    placeholder="/promo atau https://..."
                                    value={formData.link}
                                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                    className="form-input"
                                />
                            </div>

                            {/* Active Toggle */}
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    className="checkbox-input"
                                />
                                <span className="checkbox-label">Tampilkan banner ini</span>
                            </label>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`save-btn ${saving ? 'disabled' : ''}`}
                            >
                                <Save size={18} />
                                {saving ? 'Menyimpan...' : 'Simpan Banner'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Banner List */}
                <div className="banner-list">
                    {loading ? (
                        <div className="loading-state">
                            Loading...
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="empty-state">
                            <ImageIcon size={48} color="#ddd" className="empty-icon" />
                            <p className="empty-text">Belum ada banner</p>
                        </div>
                    ) : (
                        banners.map((banner) => (
                            <div
                                key={banner.id}
                                className="banner-card"
                            >
                                <GripVertical size={20} color="#ccc" className="grip-icon" />
                                <div className="banner-info">
                                    <p className="banner-title">{banner.title}</p>
                                    <p className="banner-status">
                                        {banner.is_active ? '✅ Aktif' : '⏸️ Nonaktif'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleEdit(banner)}
                                    aria-label="Edit Banner"
                                    className="action-btn edit"
                                >
                                    <Edit size={16} color="#666" />
                                </button>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    aria-label="Hapus Banner"
                                    className="action-btn delete"
                                >
                                    <Trash2 size={16} color="#ef4444" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Info */}
                <div className="tip-box">
                    <p className="tip-text">
                        💡 <strong>Tips:</strong> Gunakan gambar dengan ratio 2:1 untuk tampilan terbaik (contoh: 1200x600 px)
                    </p>
                </div>

                <style jsx>{`
                    .banner-card {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: white;
                        border-radius: 12px;
                        padding: 12px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    }
                    .grip-icon {
                        cursor: grab;
                    }
                    .banner-info {
                        flex: 1;
                    }
                    .banner-title {
                        font-weight: 600;
                        font-size: 14px;
                        margin: 0;
                    }
                    .banner-status {
                        font-size: 12px;
                        color: #999;
                        margin: 0;
                    }
                    .action-btn {
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: transform 0.2s;
                    }
                    .action-btn:hover {
                        transform: scale(1.05);
                    }
                    .action-btn.edit {
                        background: #f0f0f0;
                    }
                    .action-btn.delete {
                        background: #fee2e2;
                    }
                    .tip-box {
                        margin-top: 24px;
                        padding: 16px;
                        background: #fffbeb;
                        border-radius: 8px;
                        border: 1px solid #fde68a;
                    }
                    .tip-text {
                        font-size: 13px;
                        color: #92400e;
                        margin: 0;
                    }
                    .modal-overlay {
                        position: fixed;
                        inset: 0;
                        background-color: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 100;
                        padding: 20px;
                    }
                    .modal-content {
                        background: white;
                        border-radius: 16px;
                        width: 100%;
                        max-width: 500px;
                        padding: 24px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .modal-title {
                        font-size: 18px;
                        font-weight: 600;
                        margin: 0;
                    }
                    .close-btn {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #666;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .form-label {
                        display: block;
                        font-weight: 500;
                        font-size: 14px;
                    }
                    .form-input {
                        width: 100%;
                        padding: 10px 12px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 14px;
                        transition: border-color 0.2s;
                    }
                    .form-input:focus {
                        outline: none;
                        border-color: #10b981;
                    }
                    .upload-container {
                        display: flex;
                        gap: 8px;
                    }
                    .upload-btn {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        padding: 0 16px;
                        background: #f3f4f6;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        border: 1px solid #e5e7eb;
                        transition: background 0.2s;
                    }
                    .upload-btn:hover {
                        background: #e5e7eb;
                    }
                    .checkbox-group {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                    }
                    .checkbox-input {
                        width: 18px;
                        height: 18px;
                    }
                    .checkbox-label {
                        font-size: 14px;
                    }
                    .save-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        padding: 12px;
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: opacity 0.2s;
                    }
                    .save-btn.disabled {
                        background: #ccc;
                        cursor: not-allowed;
                    }
                    .save-btn:not(.disabled):hover {
                        opacity: 0.9;
                    }
                    .admin-page {
                        min-height: 100vh;
                        background: #f5f5f5;
                    }
                    .admin-header {
                        background: white;
                        padding: 16px 20px;
                        border-bottom: 1px solid #e5e5e5;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: sticky;
                        top: 0;
                        z-index: 50;
                    }
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .back-btn {
                        background: none;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        padding: 4px;
                        border-radius: 50%;
                        transition: background 0.2s;
                    }
                    .back-btn:hover {
                        background: #f0f0f0;
                    }
                    .header-title {
                        font-size: 18px;
                        font-weight: 700;
                        margin: 0;
                    }
                    .add-btn {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 10px 16px;
                        background: linear-gradient(135deg, #f97316, #ea580c);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                    }
                    .add-btn:hover {
                        transform: translateY(-1px);
                    }
                    .admin-content {
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .form-container {
                        background: white;
                        border-radius: 12px;
                        padding: 20px;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    }
                    .form-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 16px;
                    }
                    .form-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin: 0;
                    }
                    .close-btn-inline {
                        background: none;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        padding: 4px;
                        border-radius: 50%;
                    }
                    .close-btn-inline:hover {
                        background: #f0f0f0;
                    }
                    .form-body {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .image-preview-container {
                        position: relative;
                        width: 100%;
                        height: 150px;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .image-preview {
                        object-fit: cover;
                    }
                    .remove-image-btn {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background 0.2s;
                    }
                    .remove-image-btn:hover {
                        background: rgba(0,0,0,0.8);
                    }
                    .upload-placeholder {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 120px;
                        border: 2px dashed #ddd;
                        border-radius: 8px;
                        cursor: pointer;
                        background: #fafafa;
                        transition: background 0.2s, border-color 0.2s;
                    }
                    .upload-placeholder:hover {
                        background: #f0f0f0;
                        border-color: #f97316;
                    }
                    .upload-status {
                        color: #666;
                    }
                    .upload-text {
                        color: #666;
                        margin-top: 8px;
                        font-size: 14px;
                    }
                    .input-hint {
                        font-size: 12px;
                        color: #999;
                        margin-top: 8px;
                    }
                    .banner-list {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .loading-state {
                        text-align: center;
                        padding: 40px;
                        color: #666;
                    }
                    .empty-state {
                        text-align: center;
                        padding: 40px;
                        background: white;
                        border-radius: 12px;
                    }
                    .empty-icon {
                        margin-bottom: 12px;
                    }
                    .empty-text {
                        color: #666;
                        margin: 0;
                    }
                    .form-body {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .form-group {
                        display: flex;
                        flex-direction: column;
                    }
                    .form-label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: 500;
                        font-size: 14px;
                    }
                    .image-preview-container {
                        position: relative;
                        width: 100%;
                        height: 150px;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .image-preview {
                        object-fit: cover;
                    }
                    .remove-image-btn {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10;
                    }
                    .upload-placeholder {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 120px;
                        border: 2px dashed #ddd;
                        borderRadius: 8px;
                        cursor: pointer;
                        background: #fafafa;
                    }
                    .upload-status {
                        color: #666;
                    }
                    .upload-text {
                        color: #666;
                        margin-top: 8px;
                        font-size: 14px;
                    }
                    .form-input {
                        width: 100%;
                        padding: 10px 12px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 14px;
                        margin-top: 8px;
                    }
                    .checkbox-group {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                    }
                    .checkbox-input {
                        width: 18px;
                        height: 18px;
                    }
                    .checkbox-label {
                        font-size: 14px;
                    }
                    .save-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        padding: 12px;
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    }
                    .save-btn.disabled {
                        background: #ccc;
                        cursor: not-allowed;
                    }
                    .loading-screen {
                        padding: 40px;
                        text-align: center;
                    }
                    .access-denied-screen {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        background: #f5f5f5;
                        padding: 20px;
                    }
                    .access-denied-card {
                        background: white;
                        border-radius: 16px;
                        padding: 40px;
                        text-align: center;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        max-width: 400px;
                    }
                    .lock-icon {
                        font-size: 64px;
                        display: block;
                        margin-bottom: 16px;
                    }
                    .access-denied-title {
                        font-size: 24px;
                        font-weight: 700;
                        margin-bottom: 8px;
                    }
                    .access-denied-text {
                        color: #666;
                        margin-bottom: 24px;
                    }
                    .btn-back-home {
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #f97316, #ea580c);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    }
                    .admin-page-container {
                        min-height: 100vh;
                        background: #f5f5f5;
                    }
                    .admin-header {
                        background: white;
                        padding: 16px 20px;
                        border-bottom: 1px solid #e5e5e5;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .btn-back-arrow {
                        background: none;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                    }
                    .header-title {
                        font-size: 18px;
                        font-weight: 700;
                    }
                    .btn-add-banner {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 10px 16px;
                        background: linear-gradient(135deg, #f97316, #ea580c);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    }
                    .admin-main {
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .form-card {
                        background: white;
                        border-radius: 12px;
                        padding: 20px;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    }
                    .form-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 16px;
                    }
                    .form-title {
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .btn-close-form {
                        background: none;
                        border: none;
                        cursor: pointer;
                    }
                    .hidden-file-input {
                        display: none;
                    }
                `}</style>
            </main>
        </div>
    )
}
