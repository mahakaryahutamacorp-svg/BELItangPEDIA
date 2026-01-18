import { Product, Category, Store, Banner, FlashSale } from '@/types'

// Mock Categories
export const mockCategories: Category[] = [
    { id: '1', name: 'Makanan', slug: 'makanan', icon: '🍜', parent_id: null, order: 1 },
    { id: '2', name: 'Minuman', slug: 'minuman', icon: '🧃', parent_id: null, order: 2 },
    { id: '3', name: 'Elektronik', slug: 'elektronik', icon: '📱', parent_id: null, order: 3 },
    { id: '4', name: 'Fashion', slug: 'fashion', icon: '👕', parent_id: null, order: 4 },
    { id: '5', name: 'Kesehatan', slug: 'kesehatan', icon: '💊', parent_id: null, order: 5 },
    { id: '6', name: 'Kecantikan', slug: 'kecantikan', icon: '💄', parent_id: null, order: 6 },
    { id: '7', name: 'Rumah Tangga', slug: 'rumah-tangga', icon: '🏠', parent_id: null, order: 7 },
    { id: '8', name: 'Olahraga', slug: 'olahraga', icon: '⚽', parent_id: null, order: 8 },
]

// Mock Stores
export const mockStores: Store[] = [
    {
        id: 'store-1',
        user_id: 'user-1',
        name: 'Toko Berkah Jaya',
        description: 'Menjual berbagai kebutuhan sehari-hari dengan harga terjangkau',
        logo_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100',
        banner_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        address: 'Jl. Pahlawan No. 123, Belitang',
        latitude: -4.1234,
        longitude: 104.5678,
        rating: 4.8,
        total_reviews: 156,
        total_products: 45,
        is_verified: true,
        created_at: '2024-01-01',
        distance: 1.2,
    },
    {
        id: 'store-2',
        user_id: 'user-2',
        name: 'Warung Makan Bu Siti',
        description: 'Masakan rumahan khas Palembang',
        logo_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100',
        banner_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        address: 'Jl. Merdeka No. 45, Belitang',
        latitude: -4.1256,
        longitude: 104.5690,
        rating: 4.9,
        total_reviews: 234,
        total_products: 28,
        is_verified: true,
        created_at: '2024-01-15',
        distance: 0.8,
    },
    {
        id: 'store-3',
        user_id: 'user-3',
        name: 'Cell Phone Center',
        description: 'Pusat HP dan aksesoris terlengkap',
        logo_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100',
        banner_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
        address: 'Jl. Sudirman No. 88, Belitang',
        latitude: -4.1278,
        longitude: 104.5712,
        rating: 4.6,
        total_reviews: 89,
        total_products: 120,
        is_verified: true,
        created_at: '2024-02-01',
        distance: 2.1,
    },
]

// Mock Products
export const mockProducts: Product[] = [
    // Makanan
    {
        id: 'prod-1',
        store_id: 'store-2',
        category_id: '1',
        name: 'Pempek Kapal Selam Isi 10',
        slug: 'pempek-kapal-selam-isi-10',
        description: 'Pempek kapal selam asli Palembang dengan isian telur utuh. Disajikan dengan cuko khas yang gurih dan pedas.',
        price: 85000,
        discount_price: 75000,
        stock: 50,
        images: [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
            'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500',
        ],
        variants: null,
        rating: 4.9,
        total_reviews: 128,
        total_sold: 456,
        is_active: true,
        created_at: '2024-06-01',
        updated_at: '2024-06-01',
        store: mockStores[1],
    },
    {
        id: 'prod-2',
        store_id: 'store-2',
        category_id: '1',
        name: 'Mie Ayam Bakso Spesial',
        slug: 'mie-ayam-bakso-spesial',
        description: 'Mie ayam dengan topping bakso sapi gurih, pangsit, dan sayuran segar',
        price: 25000,
        discount_price: null,
        stock: 100,
        images: [
            'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
        ],
        variants: null,
        rating: 4.7,
        total_reviews: 89,
        total_sold: 234,
        is_active: true,
        created_at: '2024-06-02',
        updated_at: '2024-06-02',
        store: mockStores[1],
    },
    // Elektronik
    {
        id: 'prod-3',
        store_id: 'store-3',
        category_id: '3',
        name: 'Earphone Bluetooth TWS Premium',
        slug: 'earphone-bluetooth-tws-premium',
        description: 'Earphone wireless dengan noise cancellation, battery 24 jam, touch control',
        price: 350000,
        discount_price: 249000,
        stock: 25,
        images: [
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
            'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500',
        ],
        variants: [
            {
                id: 'v1',
                name: 'Warna',
                type: 'color',
                options: [
                    { id: 'v1-1', value: 'Hitam' },
                    { id: 'v1-2', value: 'Putih' },
                    { id: 'v1-3', value: 'Biru' },
                ],
            },
        ],
        rating: 4.5,
        total_reviews: 67,
        total_sold: 189,
        is_active: true,
        created_at: '2024-05-15',
        updated_at: '2024-05-15',
        store: mockStores[2],
    },
    {
        id: 'prod-4',
        store_id: 'store-3',
        category_id: '3',
        name: 'Charger Fast Charging 65W',
        slug: 'charger-fast-charging-65w',
        description: 'Charger super cepat mendukung semua smartphone, laptop, dan tablet',
        price: 175000,
        discount_price: 145000,
        stock: 40,
        images: [
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
        ],
        variants: null,
        rating: 4.8,
        total_reviews: 45,
        total_sold: 112,
        is_active: true,
        created_at: '2024-05-20',
        updated_at: '2024-05-20',
        store: mockStores[2],
    },
    // Rumah Tangga
    {
        id: 'prod-5',
        store_id: 'store-1',
        category_id: '7',
        name: 'Beras Premium 5kg',
        slug: 'beras-premium-5kg',
        description: 'Beras putih premium kualitas terbaik, pulen dan wangi',
        price: 75000,
        discount_price: null,
        stock: 200,
        images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
        ],
        variants: null,
        rating: 4.9,
        total_reviews: 312,
        total_sold: 1234,
        is_active: true,
        created_at: '2024-04-01',
        updated_at: '2024-04-01',
        store: mockStores[0],
    },
    {
        id: 'prod-6',
        store_id: 'store-1',
        category_id: '7',
        name: 'Minyak Goreng 2 Liter',
        slug: 'minyak-goreng-2-liter',
        description: 'Minyak goreng sawit berkualitas, tidak mudah gosong',
        price: 36000,
        discount_price: 32000,
        stock: 150,
        images: [
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
        ],
        variants: null,
        rating: 4.7,
        total_reviews: 89,
        total_sold: 567,
        is_active: true,
        created_at: '2024-04-05',
        updated_at: '2024-04-05',
        store: mockStores[0],
    },
    // Fashion
    {
        id: 'prod-7',
        store_id: 'store-1',
        category_id: '4',
        name: 'Kaos Polos Premium Cotton',
        slug: 'kaos-polos-premium-cotton',
        description: 'Kaos polos bahan cotton combed 30s, nyaman dan adem',
        price: 89000,
        discount_price: 69000,
        stock: 80,
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500',
        ],
        variants: [
            {
                id: 'v2',
                name: 'Ukuran',
                type: 'size',
                options: [
                    { id: 'v2-1', value: 'S' },
                    { id: 'v2-2', value: 'M' },
                    { id: 'v2-3', value: 'L' },
                    { id: 'v2-4', value: 'XL' },
                ],
            },
            {
                id: 'v3',
                name: 'Warna',
                type: 'color',
                options: [
                    { id: 'v3-1', value: 'Hitam' },
                    { id: 'v3-2', value: 'Putih' },
                    { id: 'v3-3', value: 'Navy' },
                    { id: 'v3-4', value: 'Abu-abu' },
                ],
            },
        ],
        rating: 4.6,
        total_reviews: 156,
        total_sold: 789,
        is_active: true,
        created_at: '2024-03-10',
        updated_at: '2024-03-10',
        store: mockStores[0],
    },
    // Minuman
    {
        id: 'prod-8',
        store_id: 'store-2',
        category_id: '2',
        name: 'Es Kopi Susu Gula Aren',
        slug: 'es-kopi-susu-gula-aren',
        description: 'Kopi susu dengan pemanis gula aren asli, tersedia ukuran 500ml',
        price: 18000,
        discount_price: 15000,
        stock: 100,
        images: [
            'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500',
        ],
        variants: null,
        rating: 4.8,
        total_reviews: 234,
        total_sold: 890,
        is_active: true,
        created_at: '2024-06-10',
        updated_at: '2024-06-10',
        store: mockStores[1],
    },
]

// Mock Banners
export const mockBanners: Banner[] = [
    {
        id: 'banner-1',
        title: 'semua bisa jadi pengusaha',
        image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
        link: '/flash-sale',
        is_active: true,
        order: 1,
    },
    {
        id: 'banner-2',
        title: 'Gratis Ongkir Belitang',
        image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
        link: '/promo/gratis-ongkir',
        is_active: true,
        order: 2,
    },
    {
        id: 'banner-3',
        title: 'Dukung UMKM Lokal',
        image_url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200',
        link: '/umkm',
        is_active: true,
        order: 3,
    },
]

// Mock Flash Sale
export const mockFlashSale: FlashSale = {
    id: 'flash-1',
    title: 'Flash Sale Hari Ini',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    products: [
        { product_id: 'prod-1', flash_price: 65000, stock: 20, sold: 15, product: mockProducts[0] },
        { product_id: 'prod-3', flash_price: 199000, stock: 10, sold: 7, product: mockProducts[2] },
        { product_id: 'prod-7', flash_price: 49000, stock: 30, sold: 22, product: mockProducts[6] },
        { product_id: 'prod-8', flash_price: 12000, stock: 50, sold: 35, product: mockProducts[7] },
    ],
}

// Flash Sale End Time (untuk countdown timer)
export const flashSaleEndTime = new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours from now

// Shipping Options
export const shippingOptions = [
    {
        id: 'local-instant',
        name: 'Kurir Lokal (Instant)',
        type: 'local_courier' as const,
        estimated_days: '1-2 jam',
        price: 10000,
        icon: '🛵',
    },
    {
        id: 'local-sameday',
        name: 'Kurir Lokal (Same Day)',
        type: 'local_courier' as const,
        estimated_days: 'Hari ini',
        price: 8000,
        icon: '📦',
    },
    {
        id: 'pickup',
        name: 'Ambil di Toko',
        type: 'pickup' as const,
        estimated_days: 'Segera',
        price: 0,
        icon: '🏪',
    },
]

// Helper functions
export const getProductById = (id: string): Product | undefined => {
    return mockProducts.find(p => p.id === id)
}

export const getStoreById = (id: string): Store | undefined => {
    return mockStores.find(s => s.id === id)
}

export const getProductsByCategory = (categoryId: string): Product[] => {
    return mockProducts.filter(p => p.category_id === categoryId)
}

export const getProductsByStore = (storeId: string): Product[] => {
    return mockProducts.filter(p => p.store_id === storeId)
}

export const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase()
    return mockProducts.filter(p =>
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery)
    )
}

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

export const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}
