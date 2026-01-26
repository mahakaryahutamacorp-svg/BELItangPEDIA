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
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
    }

    if (accessDenied) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                background: '#f5f5f5',
                padding: '20px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: '400px'
                }}>
                    <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🔒</span>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Akses Ditolak</h1>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        Halaman ini hanya untuk Admin. Hubungi admin untuk mendapatkan akses.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Header */}
            <header style={{
                background: 'white',
                padding: '16px 20px',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => router.push('/')}
                        aria-label="Kembali"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <ArrowLeft size={24} color="#333" />
                    </button>
                    <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Kelola Banner</h1>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} />
                    Tambah
                </button>
            </header>

            {/* Content */}
            <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {/* Add/Edit Form */}
                {showAddForm && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
                                {editingId ? 'Edit Banner' : 'Tambah Banner Baru'}
                            </h2>
                            <button onClick={resetForm} aria-label="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={20} color="#666" />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Image Upload */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>
                                    Gambar Banner
                                </label>
                                {formData.image_url ? (
                                    <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <Image
                                            src={formData.image_url}
                                            alt="Preview"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                            aria-label="Hapus Gambar"
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                background: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '28px',
                                                height: '28px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '120px',
                                        border: '2px dashed #ddd',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: '#fafafa'
                                    }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        {uploading ? (
                                            <span style={{ color: '#666' }}>Uploading...</span>
                                        ) : (
                                            <>
                                                <Upload size={24} color="#999" />
                                                <span style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>
                                                    Upload Gambar
                                                </span>
                                            </>
                                        )}
                                    </label>
                                )}
                                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                                    Atau paste URL gambar di bawah
                                </p>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.image_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        marginTop: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>
                                    Judul Banner
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Promo Akhir Tahun"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>
                                    Link (opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="/promo atau https://..."
                                    value={formData.link}
                                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            {/* Active Toggle */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '14px' }}>Tampilkan banner ini</span>
                            </label>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    background: saving ? '#ccc' : 'linear-gradient(135deg, #10b981, #059669)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: saving ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <Save size={18} />
                                {saving ? 'Menyimpan...' : 'Simpan Banner'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Banner List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Loading...
                        </div>
                    ) : banners.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            background: 'white',
                            borderRadius: '12px'
                        }}>
                            <ImageIcon size={48} color="#ddd" style={{ marginBottom: '12px' }} />
                            <p style={{ color: '#666' }}>Belum ada banner</p>
                        </div>
                    ) : (
                        banners.map((banner) => (
                            <div
                                key={banner.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                }}
                            >
                                <GripVertical size={20} color="#ccc" style={{ cursor: 'grab' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{banner.title}</p>
                                    <p style={{ fontSize: '12px', color: '#999' }}>
                                        {banner.is_active ? '✅ Aktif' : '⏸️ Nonaktif'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleEdit(banner)}
                                    aria-label="Edit Banner"
                                    style={{
                                        padding: '8px',
                                        background: '#f0f0f0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Edit size={16} color="#666" />
                                </button>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    aria-label="Hapus Banner"
                                    style={{
                                        padding: '8px',
                                        background: '#fee2e2',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={16} color="#ef4444" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Info */}
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: '#fffbeb',
                    borderRadius: '8px',
                    border: '1px solid #fde68a'
                }}>
                    <p style={{ fontSize: '13px', color: '#92400e' }}>
                        💡 <strong>Tips:</strong> Gunakan gambar dengan ratio 2:1 untuk tampilan terbaik (contoh: 1200x600 px)
                    </p>
                </div>
            </main>
        </div>
    )
}
